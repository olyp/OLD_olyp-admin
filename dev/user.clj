(ns user
  (:require [reloaded.repl :refer [system init start stop go reset]]
            olyp-admin.app
            clojure.edn))

(reloaded.repl/set-init! #(olyp-admin.app/create-system (merge
                                                          {:olyp-central-api {:url "http://localhost:3000"}
                                                           :web {:port 3002}
                                                           :env :dev
                                                           :cookie-secret "12345678abcdef12"}
                                                          (-> "config.edn" slurp clojure.edn/read-string))))

