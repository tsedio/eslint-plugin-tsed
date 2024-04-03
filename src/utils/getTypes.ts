import {TSESTree} from "@typescript-eslint/utils";

function extractType(type?: string) {
  return type?.replace(/TS(\w+)Keyword/, "$1")
}
export function getTypes(
  node: TSESTree.PropertyDefinition,
) {

  const collectionType = (node.typeAnnotation as any)?.typeAnnotation?.typeName?.name;
  const elementType = (node.typeAnnotation?.typeAnnotation as any )?.elementType
  const itemType = elementType?.typeName?.name || extractType(elementType?.type) ;

  if (!itemType) {
    if (["Map", "Set"].includes(collectionType)) {
      const itemType = (node.typeAnnotation as any)?.typeAnnotation?.typeArguments.params.at(-1)?.type

      return {
        collectionType,
        itemType: extractType(itemType),
      }
    }
  }

  return {
    collectionType: "Array",
    itemType: itemType || "Object"
  }
}
