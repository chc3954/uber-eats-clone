/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n": types.RestaurantPartsFragmentDoc,
    "\n  fragment CategoryParts on Category {\n    id\n    name\n    iconImg\n    slug\n    restaurantCount\n  }\n": types.CategoryPartsFragmentDoc,
    "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n": types.DishPartsFragmentDoc,
    "\n  fragment OrderParts on Order {\n    id\n    createdAt\n    total\n  }\n": types.OrderPartsFragmentDoc,
    "\n  fragment FullOrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n": types.FullOrderPartsFragmentDoc,
    "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n": types.MeDocument,
    "\n  query category($input: CategoryInput!) {\n    category(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n  \n  \n": types.CategoryDocument,
    "\n  query restaurants($input: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n    restaurants(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n  \n": types.RestaurantsDocument,
    "\n  query restaurant($input: RestaurantInput!) {\n    restaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n  \n  \n": types.RestaurantDocument,
    "\n  mutation createOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ok\n      orderId\n      error\n    }\n  }\n": types.CreateOrderDocument,
    "\n  query searchRestaurant($input: SearchRestaurantInput!) {\n    searchRestaurant(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n": types.SearchRestaurantDocument,
    "\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  subscription cookedOrders {\n    cookedOrders {\n      ...FullOrderParts\n    }\n  }\n  \n": types.CookedOrdersDocument,
    "\n  mutation takeOrder($input: TakeOrderInput!) {\n    takeOrder(input: $input) {\n      ok\n      error\n    }\n  }\n": types.TakeOrderDocument,
    "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n": types.LoginDocument,
    "\n  mutation createDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n    }\n  }\n": types.CreateDishDocument,
    "\n  mutation createRestaurant($input: CreateRestaurantInput!) {\n    createRestaurant(input: $input) {\n      ok\n      error\n      restaurantId\n    }\n  }\n": types.CreateRestaurantDocument,
    "\n  query myRestaurant($input: MyRestaurantInput!) {\n    myRestaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n        orders {\n          ...OrderParts\n        }\n      }\n    }\n  }\n  \n  \n  \n": types.MyRestaurantDocument,
    "\n  mutation createPayment($input: CreatePaymentInput!) {\n    createPayment(input: $input) {\n      ok\n      error\n    }\n  }\n": types.CreatePaymentDocument,
    "\n  subscription pendingOrders {\n    pendingOrders {\n      ...FullOrderParts\n    }\n  }\n  \n": types.PendingOrdersDocument,
    "\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n": types.MyRestaurantsDocument,
    "\n  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n": types.VerifyEmailDocument,
    "\n              fragment VerifiedUser on User {\n                verified\n              }\n            ": types.VerifiedUserFragmentDoc,
    "\n  mutation editProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n": types.EditProfileDocument,
    "\n                fragment EditUser on User {\n                  verified\n                  email\n                }\n              ": types.EditUserFragmentDoc,
    "\n  subscription orderUpdates($input: OrderUpdatesInput!) {\n    orderUpdates(input: $input) {\n      ...FullOrderParts\n    }\n  }\n  \n": types.OrderUpdatesDocument,
    "\n  query getOrder($input: GetOrderInput!) {\n    getOrder(input: $input) {\n      ok\n      error\n      order {\n        ...FullOrderParts\n      }\n    }\n  }\n  \n": types.GetOrderDocument,
    "\n  mutation editOrder($input: EditOrderInput!) {\n    editOrder(input: $input) {\n      ok\n      error\n    }\n  }\n": types.EditOrderDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n"): (typeof documents)["\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CategoryParts on Category {\n    id\n    name\n    iconImg\n    slug\n    restaurantCount\n  }\n"): (typeof documents)["\n  fragment CategoryParts on Category {\n    id\n    name\n    iconImg\n    slug\n    restaurantCount\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OrderParts on Order {\n    id\n    createdAt\n    total\n  }\n"): (typeof documents)["\n  fragment OrderParts on Order {\n    id\n    createdAt\n    total\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment FullOrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment FullOrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query category($input: CategoryInput!) {\n    category(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query category($input: CategoryInput!) {\n    category(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query restaurants($input: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n    restaurants(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query restaurants($input: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n    restaurants(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query restaurant($input: RestaurantInput!) {\n    restaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query restaurant($input: RestaurantInput!) {\n    restaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ok\n      orderId\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ok\n      orderId\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query searchRestaurant($input: SearchRestaurantInput!) {\n    searchRestaurant(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query searchRestaurant($input: SearchRestaurantInput!) {\n    searchRestaurant(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription cookedOrders {\n    cookedOrders {\n      ...FullOrderParts\n    }\n  }\n  \n"): (typeof documents)["\n  subscription cookedOrders {\n    cookedOrders {\n      ...FullOrderParts\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation takeOrder($input: TakeOrderInput!) {\n    takeOrder(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation takeOrder($input: TakeOrderInput!) {\n    takeOrder(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createRestaurant($input: CreateRestaurantInput!) {\n    createRestaurant(input: $input) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"): (typeof documents)["\n  mutation createRestaurant($input: CreateRestaurantInput!) {\n    createRestaurant(input: $input) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myRestaurant($input: MyRestaurantInput!) {\n    myRestaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n        orders {\n          ...OrderParts\n        }\n      }\n    }\n  }\n  \n  \n  \n"): (typeof documents)["\n  query myRestaurant($input: MyRestaurantInput!) {\n    myRestaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n        orders {\n          ...OrderParts\n        }\n      }\n    }\n  }\n  \n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createPayment($input: CreatePaymentInput!) {\n    createPayment(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createPayment($input: CreatePaymentInput!) {\n    createPayment(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription pendingOrders {\n    pendingOrders {\n      ...FullOrderParts\n    }\n  }\n  \n"): (typeof documents)["\n  subscription pendingOrders {\n    pendingOrders {\n      ...FullOrderParts\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n              fragment VerifiedUser on User {\n                verified\n              }\n            "): (typeof documents)["\n              fragment VerifiedUser on User {\n                verified\n              }\n            "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation editProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n                fragment EditUser on User {\n                  verified\n                  email\n                }\n              "): (typeof documents)["\n                fragment EditUser on User {\n                  verified\n                  email\n                }\n              "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription orderUpdates($input: OrderUpdatesInput!) {\n    orderUpdates(input: $input) {\n      ...FullOrderParts\n    }\n  }\n  \n"): (typeof documents)["\n  subscription orderUpdates($input: OrderUpdatesInput!) {\n    orderUpdates(input: $input) {\n      ...FullOrderParts\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getOrder($input: GetOrderInput!) {\n    getOrder(input: $input) {\n      ok\n      error\n      order {\n        ...FullOrderParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getOrder($input: GetOrderInput!) {\n    getOrder(input: $input) {\n      ok\n      error\n      order {\n        ...FullOrderParts\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editOrder($input: EditOrderInput!) {\n    editOrder(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation editOrder($input: EditOrderInput!) {\n    editOrder(input: $input) {\n      ok\n      error\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;