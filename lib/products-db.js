import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getCategories,
    getProducts,
    } from "@/app/actions/products"

    // Re-exportar las funciones
    export {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getCategories,
    getProducts,
    }

    // Alias para addProduct para mantener compatibilidad
    export const createProduct = addProduc
