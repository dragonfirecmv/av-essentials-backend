
export const flatternToArrayFromCertainKey = (obj: object, certain_key: string, sanitize = true): any[] => {
  let temp = { ...obj }

  let tempIter = [];

  const recurs = (objChildren) => {

    objChildren.forEach(item => {
      let prepareSanitizing = { ...item }
      
      if (sanitize)
        delete prepareSanitizing[certain_key]

      tempIter = [...tempIter, { ...prepareSanitizing }]

      if (item[certain_key].length > 0) {
        recurs(item.children)
      }
    })
  }

  recurs(obj[certain_key])
  return tempIter
}

// export interface IObjectShape<T> {
//   [key: string]: any
//   T: any
// }