import type { Album } from "@/types";

export const getCoverPath = (album: Album) => {
  const [_, pathAndQuery] = album.cover?.split('/o/')
  const [encodedPath] = pathAndQuery.split('?')
  return decodeURIComponent(encodedPath)
}

export const applyDrag = (arr: Album[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  
  const result = [...arr];
  let itemToAdd = payload;
  
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }
  
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  
  return result;
}