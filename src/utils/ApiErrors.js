class ApiError extends Error{
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = ""
        

    ){
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

    //    niche ki code production grade me use kiya jata hai itta koi khas nhi hai mere liye ye error ko pta krne ke liye use krte hai kis segment me error hai
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }


    }
}
export {ApiError}