import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { MotorcycleModel, CompatibilityRule } from "./types"

// Función para convertir _id de MongoDB a id string para modelos de motos
function formatMotorcycleModel(model: any): MotorcycleModel {
  return {
    id: model._id.toString(),
    brand: model.brand,
    model: model.model,
    years: model.years,
    createdAt: model.createdAt?.toISOString(),
    updatedAt: model.updatedAt?.toISOString(),
  }
}

// Función para convertir _id de MongoDB a id string para reglas de compatibilidad
function formatCompatibilityRule(rule: any): CompatibilityRule {
  return {
    id: rule._id.toString(),
    categoryId: rule.categoryId,
    productIds: rule.productIds,
    motorcycleIds: rule.motorcycleIds,
    isUniversal: rule.isUniversal || false,
    notes: rule.notes,
    createdAt: rule.createdAt?.toISOString(),
    updatedAt: rule.updatedAt?.toISOString(),
  }
}

// Obtener todos los modelos de motos
export async function getMotorcycleModels(): Promise<MotorcycleModel[]> {
  const motorcyclesCollection = getCollection("motorcycle_models")
  const models = await motorcyclesCollection.find({}).sort({ brand: 1, model: 1 }).toArray()
  return models.map(formatMotorcycleModel)
}

// Obtener modelos de motos por marca
export async function getMotorcycleModelsByBrand(brand: string): Promise<MotorcycleModel[]> {
  const motorcyclesCollection = getCollection("motorcycle_models")
  const models = await motorcyclesCollection.find({ brand }).sort({ model: 1 }).toArray()
  return models.map(formatMotorcycleModel)
}

// Añadir un nuevo modelo de moto
export async function addMotorcycleModel(
  model: Omit<MotorcycleModel, "id" | "createdAt" | "updatedAt">,
): Promise<MotorcycleModel> {
  const motorcyclesCollection = getCollection("motorcycle_models")

  const modelToInsert = {
    ...model,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await motorcyclesCollection.insertOne(modelToInsert)

  return {
    id: result.insertedId.toString(),
    ...model,
    createdAt: modelToInsert.createdAt.toISOString(),
    updatedAt: modelToInsert.updatedAt.toISOString(),
  }
}

// Actualizar un modelo de moto
export async function updateMotorcycleModel(id: string, updates: Partial<MotorcycleModel>): Promise<MotorcycleModel> {
  const motorcyclesCollection = getCollection("motorcycle_models")

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  await motorcyclesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedModel = await motorcyclesCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedModel) {
    throw new Error("Modelo de moto no encontrado después de la actualización")
  }

  return formatMotorcycleModel(updatedModel)
}

// Eliminar un modelo de moto
export async function deleteMotorcycleModel(id: string): Promise<void> {
  const motorcyclesCollection = getCollection("motorcycle_models")
  await motorcyclesCollection.deleteOne({ _id: new ObjectId(id) })

  // También eliminar las reglas de compatibilidad asociadas
  const rulesCollection = getCollection("compatibility_rules")
  await rulesCollection.updateMany({ motorcycleIds: id }, { $pull: { motorcycleIds: id } })
}

// Obtener reglas de compatibilidad
export async function getCompatibilityRules(): Promise<CompatibilityRule[]> {
  const rulesCollection = getCollection("compatibility_rules")
  const rules = await rulesCollection.find({}).toArray()
  return rules.map(formatCompatibilityRule)
}

// Obtener reglas de compatibilidad por categoría
export async function getCompatibilityRulesByCategory(categoryId: string): Promise<CompatibilityRule[]> {
  const rulesCollection = getCollection("compatibility_rules")
  const rules = await rulesCollection.find({ categoryId }).toArray()
  return rules.map(formatCompatibilityRule)
}

// Añadir una nueva regla de compatibilidad
export async function addCompatibilityRule(
  rule: Omit<CompatibilityRule, "id" | "createdAt" | "updatedAt">,
): Promise<CompatibilityRule> {
  const rulesCollection = getCollection("compatibility_rules")

  const ruleToInsert = {
    ...rule,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await rulesCollection.insertOne(ruleToInsert)

  // Actualizar los productos con esta información de compatibilidad
  await updateProductsCompatibility(rule.productIds, rule.motorcycleIds)

  return {
    id: result.insertedId.toString(),
    ...rule,
    createdAt: ruleToInsert.createdAt.toISOString(),
    updatedAt: ruleToInsert.updatedAt.toISOString(),
  }
}

// Actualizar una regla de compatibilidad
export async function updateCompatibilityRule(
  id: string,
  updates: Partial<CompatibilityRule>,
): Promise<CompatibilityRule> {
  const rulesCollection = getCollection("compatibility_rules")

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  await rulesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedRule = await rulesCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedRule) {
    throw new Error("Regla de compatibilidad no encontrada después de la actualización")
  }

  // Si se actualizaron los productos o motos, actualizar la compatibilidad
  if (updates.productIds || updates.motorcycleIds) {
    const productIds = updates.productIds || updatedRule.productIds
    const motorcycleIds = updates.motorcycleIds || updatedRule.motorcycleIds
    await updateProductsCompatibility(productIds, motorcycleIds)
  }

  return formatCompatibilityRule(updatedRule)
}

// Eliminar una regla de compatibilidad
export async function deleteCompatibilityRule(id: string): Promise<void> {
  const rulesCollection = getCollection("compatibility_rules")

  // Obtener la regla antes de eliminarla para actualizar los productos
  const rule = await rulesCollection.findOne({ _id: new ObjectId(id) })

  if (rule) {
    // Eliminar la compatibilidad de los productos afectados
    await removeProductsCompatibility(rule.productIds, rule.motorcycleIds)
  }

  await rulesCollection.deleteOne({ _id: new ObjectId(id) })
}

// Actualizar la compatibilidad de los productos
async function updateProductsCompatibility(productIds: string[], motorcycleIds: string[]): Promise<void> {
  const productsCollection = getCollection("products")
  const motorcyclesCollection = getCollection("motorcycle_models")

  // Obtener los modelos de motos
  const motorcycles = await motorcyclesCollection
    .find({ _id: { $in: motorcycleIds.map((id) => new ObjectId(id)) } })
    .toArray()

  // Preparar los datos de compatibilidad
  const compatibilityData = motorcycles.map((moto) => ({
    brand: moto.brand,
    model: moto.model,
    years: moto.years,
  }))

  // Expandir los años para cada modelo
  const expandedCompatibility = compatibilityData.flatMap((compat) =>
    compat.years.map((year) => ({
      brand: compat.brand,
      model: compat.model,
      year,
    })),
  )

  // Actualizar cada producto
  for (const productId of productIds) {
    // Obtener el producto actual para preservar compatibilidades existentes
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) })

    if (product) {
      // Combinar compatibilidades existentes con las nuevas
      const existingCompatibility = product.compatibleWith || []

      // Filtrar duplicados
      const newCompatibility = [...existingCompatibility, ...expandedCompatibility].filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.brand === value.brand && t.model === value.model && t.year === value.year),
      )

      // Actualizar el producto
      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            compatibleWith: newCompatibility,
            updatedAt: new Date(),
          },
        },
      )
    }
  }
}

// Eliminar la compatibilidad de los productos
async function removeProductsCompatibility(productIds: string[], motorcycleIds: string[]): Promise<void> {
  const productsCollection = getCollection("products")
  const motorcyclesCollection = getCollection("motorcycle_models")

  // Obtener los modelos de motos
  const motorcycles = await motorcyclesCollection
    .find({ _id: { $in: motorcycleIds.map((id) => new ObjectId(id)) } })
    .toArray()

  // Preparar los datos de compatibilidad a eliminar
  const compatibilityToRemove = motorcycles.flatMap((moto) =>
    moto.years.map((year) => ({
      brand: moto.brand,
      model: moto.model,
      year,
    })),
  )

  // Actualizar cada producto
  for (const productId of productIds) {
    // Obtener el producto actual
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) })

    if (product && product.compatibleWith) {
      // Filtrar las compatibilidades a mantener
      const updatedCompatibility = product.compatibleWith.filter(
        (compat) =>
          !compatibilityToRemove.some(
            (remove) => remove.brand === compat.brand && remove.model === compat.model && remove.year === compat.year,
          ),
      )

      // Actualizar el producto
      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            compatibleWith: updatedCompatibility,
            updatedAt: new Date(),
          },
        },
      )
    }
  }
}

// Verificar compatibilidad de un producto con una moto específica
export async function checkProductCompatibility(
  productId: string,
  brand: string,
  model: string,
  year: number,
): Promise<boolean> {
  const productsCollection = getCollection("products")

  const product = await productsCollection.findOne({ _id: new ObjectId(productId) })

  if (!product || !product.compatibleWith) {
    return false
  }

  return product.compatibleWith.some(
    (compat) => compat.brand === brand && compat.model === model && compat.year === year,
  )
}

// Obtener todos los productos compatibles con una moto específica
export async function getCompatibleProducts(
  brand: string,
  model: string,
  year: number,
  category?: string,
): Promise<string[]> {
  const productsCollection = getCollection("products")

  const filter: any = {
    compatibleWith: {
      $elemMatch: {
        brand,
        model,
        year,
      },
    },
  }

  if (category) {
    filter.category = category
  }

  const products = await productsCollection.find(filter).toArray()

  return products.map((product) => product._id.toString())
}

