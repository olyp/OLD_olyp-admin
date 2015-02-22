(ns olyp-admin.web-handler
  (:require cheshire.core
            [optimus.assets :as assets]
            [optimus.optimizations :as optimizations]
            [optimus.strategies :as strategies]
            bidi.ring
            ring.middleware.anti-forgery
            ring.middleware.session
            ring.middleware.session.cookie
            ring.middleware.params
            [olyp-admin.web-handlers.home-handler :as home-handler]
            [olyp-admin.web-handlers.central-api-proxy-handler :as central-api-proxy-handler])
  (:import [java.util.concurrent TimeUnit]))

(defn first-step-optimizations [assets options]
  (-> assets
      (optimizations/minify-js-assets options)
      (optimizations/minify-css-assets options)
      (optimizations/inline-css-imports)))

(defn second-step-optimizations [assets options]
  (-> assets
      (optimizations/concatenate-bundles)
      (optimizations/add-cache-busted-expires-headers)
      (optimizations/add-last-modified-headers)))

(defn get-unoptimizable-assets [env]
  (concat
   (if (= :dev env)
     (assets/load-bundle "public" "lib.js" ["/js/lib/react-with-addons-0.12.2.js"])
     (assets/load-bundle "public" "lib.js" ["/js/lib/react-with-addons-0.12.2.min.js"]))))

(defn get-optimizable-assets []
  (concat
   (assets/load-bundle "public" "lib.js" ["/js/lib/when-3.6.4.js"
                                          "/js/lib/react-router-0.11.6.js"
                                          "/js/olyp_app_utils/http.js"])
   ;; (assets/load-bundle "public" "reusable_crud.js" ["/js/reusable_crud/reusable_crud_components.js"
   ;;                                                  "/js/reusable_crud/reusable_crud_actions.js"
   ;;                                                  "/js/reusable_crud/reusable_crud_store.js"])
   (assets/load-bundle "public" "app.css" ["/bootstrap/css/bootstrap.css"
                                           "/bootstrap/css/bootstrap-theme.css"
                                           "/css/app.css"])
   ;; (assets/load-bundle "public" "users.js" ["/js/users/users_components.js"
   ;;                                          "/js/users/users_store.js"
   ;;                                          "/js/users/users_actions.js"
   ;;                                          "/js/users/users.js"])
   ;; (assets/load-bundle "public" "customers.js" ["/js/customers/customers_components.js"
   ;;                                              "/js/customers/customers.js"])
   (assets/load-bundle "public" "app.js" ["/js/stores/store_utils.js"
                                          "/js/stores/user_store.js"
                                          "/js/stores/customer_store.js"
                                          "/js/stores/password_store.js"
                                          "/js/stores/monthly_rental_store.js"
                                          "/js/components/user_components.js"
                                          "/js/components/customer_components.js"
                                          "/js/components/monthly_rental_components.js"
                                          "/js/actions/user_actions.js"
                                          "/js/actions/customer_actions.js"
                                          "/js/app.js"])))

(defn get-assets [env]
  (if (= :dev env)
    (concat
     (get-unoptimizable-assets env)
     (get-optimizable-assets))
    (-> (concat
         (get-unoptimizable-assets env)
         (-> (get-optimizable-assets)
             (first-step-optimizations {})))
        (second-step-optimizations {}))))

(defn wrap-anti-forgery-token-hack [handler]
  (fn [req]
    (handler (assoc req :anti-forgery-token ring.middleware.anti-forgery/*anti-forgery-token*))))

(defn wrap-olyp-env [handler olyp-central-api-client-ctx]
  (fn [req]
    (handler (assoc req
               :olyp-env {:api-ctx olyp-central-api-client-ctx}))))

(def app-handler
  (bidi.ring/make-handler
   [""
    {"/" {:get #'home-handler/home-page}
     "/central_api_proxy" {[[#".*" :path] ""] central-api-proxy-handler/central-api-proxy}}]))

(defn create-actual-handler [olyp-central-api-client-ctx cookie-secret]
  (->
   app-handler
   (wrap-olyp-env olyp-central-api-client-ctx)
   wrap-anti-forgery-token-hack
   ring.middleware.anti-forgery/wrap-anti-forgery
   (ring.middleware.session/wrap-session
    {:store (ring.middleware.session.cookie/cookie-store
             {:key cookie-secret})
     :cookie-name "olyp-admin"
     :cookie-attrs {:max-age (.convert TimeUnit/SECONDS 30 TimeUnit/DAYS)}})
   ring.middleware.params/wrap-params))

(defn create-handler [{:keys [env olyp-central-api-client-ctx cookie-secret]}]
  ((if (= :dev env)
      strategies/serve-live-assets
      strategies/serve-frozen-assets)
   (create-actual-handler olyp-central-api-client-ctx cookie-secret)
   #(get-assets env)
   optimizations/none
   {}))
