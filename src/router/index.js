import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import IndexesView from '../components/IndexesView'
import GenerateDataset from '../components/GenerateDataset'
import ActualizeElastic from '../components/ActualizeElastic'
import BrowseData from '../components/BrowseData'
import ProductView from "../components/product_view/ProductView"
import ProductTreeView from "../components/product_view/ProductTreeView"
import ProductReviewView from "../components/product_view/ProductReviewView"
import ClusterReviews from "../components/experiments/ClusterReviews";
import ExperimentsView from "../components/experiments/ExperimentsView";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: HelloWorld
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
      component: ProductTreeView
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
    }
  ]
})
