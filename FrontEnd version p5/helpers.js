clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

//Take two vectors array and return the angles between them
calculateAngle = (A, B) => {
  if(A.length != B.length)
    throw "The vectors must be of equal size";

  //calculate cross product of A and B
  var crossProduct = 0;
  for (var i = 0; i < A.length; i++) {
    crossProduct += A[i] * B[i];
  }

  var magnitudeA = magnitude(A);
  var magnitudeB = magnitude(B);

  var angle = Math.acos(crossProduct / (magnitudeA * magnitudeB));

  return angle;
}


magnitude = (vector) => {
  return Math.sqrt(vector.reduce((carry, now) => {
    return carry + now ** 2
  }, 0));
}

function test(origin, destination) {
  //X axis: Cabeceo
  //Y axis: Guiño
  // return [calculateAngle([origin.y, origin.z], origin.y), ]
}