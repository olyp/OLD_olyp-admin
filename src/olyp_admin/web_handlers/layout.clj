(ns olyp-admin.web-handlers.layout
  (:require [hiccup.page :refer [html5]]
            [optimus.link :as link]))

(defn layout [req & contents]
  (html5
   [:head
    [:meta {:charset "utf-8"}]
    [:meta {:name "csrf-token" :content (:anti-forgery-token req)}]
    [:title "Admin - Oslo Lydproduksjon"]
    (map (fn [url] [:link {:rel "stylesheet" :href url}])
         (link/bundle-paths req ["app.css"]))]
   [:body
    [:div.navbar.navbar-default
     [:div.container-fluid
      [:div.navbar-header
       [:span.navbar-brand "Olyp Admin"]]
      [:ul.nav.navbar-nav
       [:li [:a {:href "/users"} "Users"]]]]]
    [:div {:class "container-fluid"} contents]]))
