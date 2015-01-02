(ns olyp-admin.web-handlers.central-api-proxy-handler
  (:require [olyp-app-utils.olyp-central-api-client :as central-api-client]))

(defn central-api-proxy [{:keys [request-method route-params body] {:keys [api-ctx]} :olyp-env}]
  (let [{:keys [status headers httpkit-res]} (central-api-client/request api-ctx request-method (:path route-params) body)]
    {:status status
     :headers (zipmap (map name (keys headers)) (vals headers))
     :body (:body httpkit-res)}))
