// this is the file where we will handle all the asynchronous operations in our application. we are going to talk many times to our database so better to create a separate file for handling all the asynchronous it si like prps is js like (button){name, size, color} and we can use this prps in many places in our application. same as here we are creating a function that will handle all the asynchronous operations and we can use this function in many places in our application.

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch((error) => next(error));
  };
};

    // .catch((error) => {
    //     // res.status(error.code || 500).json({
    //     //     success: false,
    //     //     message: error.message || "Internal Server Error"
    //     // })
    //     .catch(error) => next(error)}
    // })

/* steps to register user
   1. get user detail from frontEnd
      validation (is emptyName or Passowrd is empty)
      check user is already login : by userName or email
      check user file is like image and avator
      if availble push to cloudnay and take it's refrence
     check is data is present or not on cloudnary

   2. now create user object -> create entry in db -> if user crated it will return all value passed by the user like (email, pasward, name and all) 
   but in response to user remove password and freshtoken field from the response
   -> check usr is creted or not -> if yes return response YES
      

 */







export default asyncHandler;


/*
1->step

function parent(childFunction) {
    console.log("Parent started");

    childFunction();

    console.log("Parent ended");
}

function child() {
    console.log("I am child");
}

parent(child);

// Inside the parent, JavaScript sees

2->step

function parent(child) {
    console.log("Parent started");

    child();

    console.log("Parent ended");
}

*/

// const asyncHandler = () => {}

// this is heigher order function that will take a function as an argument and return a new function that will handle the asynchronous operations and we can use this function in many places in our application.

// const asyncHandler = (fn) => {} normal function
// const asyncHandler = (fn) => {() =>{}}
// also you can remove the extra parentheses and write it like this const asyncHandler = (fn) => {} but we are using the extra parentheses to return a new function that will handle the asynchronous operations.

//  const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next);
//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         });
//     }
//  }
