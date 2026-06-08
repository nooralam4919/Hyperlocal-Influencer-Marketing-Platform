class ApiError extends Error { //js have build in class Error
    constructor( statusCode, message="something went wrong", errors = [], stack = ""){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;

        if(stack){
            this.stack = stack;
        }else{
        Error.captureStackTrace(this, this.constructor);
        }

    }
}

export default ApiError;

// this is the file where we will handle all the errors in our application. we are going to talk many times to our database so better to create a separate file for handling all the errors. it is like props in js like (button){name, size, color} and we can use this props in many places in our application. same as here we are creating a class that will handle all the errors and we can use this class in many places in our application.