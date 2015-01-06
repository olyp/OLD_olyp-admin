(ns olyp-admin.main
  (:gen-class)
  (:require olyp-admin.app
            [com.stuartsierra.component :as component]))

(defn -main [& args]
  (->>
   {:olyp-central-api {:url "http://localhost:3000"}
    :web {:port 3002}
    :env :dev
    :cookie-secret "12345678abcdef12"}
   olyp-admin.app/create-system
   component/start))

