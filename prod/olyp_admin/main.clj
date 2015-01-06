(ns olyp-admin.main
  (:gen-class)
  (:require olyp-admin.app
            [com.stuartsierra.component :as component]
            [clojure.java.io :as io])
  (:import java.io.PushbackReader))

(defn -main [& args]
  (with-open [r (io/reader (str (first args)))]
    (->> (read (java.io.PushbackReader. r))
         (olyp-admin.app/create-system)
         (component/start))))

