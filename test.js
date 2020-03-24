let array1 = [
  { name: "test1", number: "A1" },
  { name: "test2", number: "A2" },
  { name: "test3", number: "A3" },
  { name: "test4", number: "A4" }
];

let object2 = {};

for (var i of array1) {
  object2[i.number] = i.number;
}

console.log(object2);
