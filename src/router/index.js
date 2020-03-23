import Vue from 'vue'
import Router from 'vue-router'
import IndexesView from '../components/IndexesView'
import GenerateDataset from '../components/GenerateDataset'
import ActualizeElastic from '../components/ActualizeElastic'
import BrowseData from '../components/BrowseData'
import ProductView from "../components/product_view/ProductView"
import ProductTreeView from "../components/product_view/ProductTreeView"
import ProductReviewView from "../components/product_view/ProductReviewView"
import ClusterReviews from "../components/cluster_experiments/ClusterReviews";
import ExperimentsView from "../components/cluster_experiments/ExperimentsView";
import ModelsDemo from "../components/demo/ModelsDemo";
import PosConSentenceDemo from "../components/demo/PosConSentenceDemo";
import TextRatingDemo from "../components/demo/TextRatingDemo";
import IrrelevantDemo from "../components/demo/IrrelevantDemo";
import LoginUser from "../components/User/LoginUser";
import LogoutUser from "../components/User/LogoutUser";
import NotLoggedHome from "../components/User/NotLoggedHome";
import UserHome from "../components/User/UserHome";

//import store from "../services/store";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'not_logged_home',
      component: NotLoggedHome
    },
    {
      path: '/home_user',
      name: 'user_home',
      component: UserHome
    },
    {
      path: '/indexes_view',
      name: 'indexes_view',
      component: IndexesView
    },
    {
      path: '/generate_dataset',
      name: 'generate_dataset',
      component: GenerateDataset
    },
    {
      path: '/actualize_es',
      name: 'actualize_es',
      component: ActualizeElastic
    },
    {
      path: '/browse_data',
      name: 'browse_data',
      component: BrowseData
    },
     {
      path: '/product/tree_view',
      name: 'product_tree_view',
      component: ProductTreeView,

      /* beforeEnter (to, from, next) {
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }*/
    },
    {
      path: '/product/product_view',
      name: 'product_view',
      component: ProductView
    },
    {
      path: '/product/review_view',
      name: 'review_view',
      component: ProductReviewView
    },
    {
      path: '/experiment/cluster_reviews',
      name: 'cluster_reviews',
      component: ClusterReviews
    },
    {
      path: '/experiment/view',
      name: 'experiment_view',
      component: ExperimentsView
    },
    {
      path: '/demo/demo',
      name: 'demo',
      component: ModelsDemo
    },
    {
      path: '/demo/pos_con',
      name: 'demo_pos_con',
      component: PosConSentenceDemo
    },
    {
      path: '/demo/text_rating',
      name: 'text_rating',
      component: TextRatingDemo
    },
    {
      path: '/demo/irrelevant',
      name: 'irrelevant',
      component: IrrelevantDemo
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutUser
    }
  ]
})
