(ns olyp-admin.web-handlers.users-handler
  (:require [olyp-admin.web-handlers.layout :refer [layout]]
            [optimus.link :as link]
            [olyp-app-utils.olyp-central-api-client :as central-api-client]))

(defn users-page [req]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body
   (layout
    req
    [:div#users-app]
    (map (fn [url] [:script {:src url}])
         (link/bundle-paths req ["lib.js" "users.js"])))})
