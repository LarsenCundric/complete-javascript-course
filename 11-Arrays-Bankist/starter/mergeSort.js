// MERGE SORT with compare function
function mergeSort(arr = [2, 5, 2, 1, 3, 5, 6, 3, 8, 3, 1], compareFn = (a, b) => a - b) {

  function mergeArrays(arr1, arr2) {
    const arr = new Array(arr1.length + arr2.length);
    let i1 = 0;
    let i2 = 0;
    for (let i = 0; i < arr.length; i++) {
      if (compareFn(arr1[i1], arr2[i2]) < 0 || i2 === arr2.length) {
        arr[i] = arr1[i1];
        i1++;
      } else {
        arr[i] = arr2[i2]
        i2++;
      }
    }
    return arr;
  }

  function mergeSortRek(arr) {
    if (arr.length < 2) return arr;
  
    const left = arr.slice(0, arr.length / 2);
    const right = arr.slice(arr.length / 2);
  
    const leftSorted = mergeSortRek(left);
    const rightSorted = mergeSortRek(right);
    
    return mergeArrays(leftSorted, rightSorted);
  }

  return mergeSortRek(arr);
}

const sortedArr = mergeSort(undefined, (a, b) => a - b) // [4, 2, 5, 2, 3]
console.log(sortedArr);