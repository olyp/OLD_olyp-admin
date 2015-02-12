(ns olyp-admin.web-handlers.home-handler
  (:require [hiccup.page :refer [html5]]
            [optimus.link :as link]))

(defn home-page [req]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body
   (html5
    [:head
     [:meta {:charset "utf-8"}]
     [:meta {:name "csrf-token" :content (:anti-forgery-token req)}]
     [:title "Admin - Oslo Lydproduksjon"]
     (map (fn [url] [:link {:rel "stylesheet" :href url}])
          (link/bundle-paths req ["app.css"]))]
    [:body
     [:div#olyp-admin-app]
     (map (fn [url] [:script {:src url}])
          (link/bundle-paths req ["lib.js" "app.js"]))])})
