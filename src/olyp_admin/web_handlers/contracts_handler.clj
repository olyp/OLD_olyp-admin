(ns olyp-admin.web-handlers.contracts-handler
  (:require [olyp-admin.web-handlers.layout :refer [layout]]
            [optimus.link :as link]))

(defn contracts-page [req]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body
   (layout
    req
    [:div#contracts-app]
    (map (fn [url] [:script {:src url}])
         (link/bundle-paths req ["lib.js" "reusable_crud.js" "contracts.js"])))})
