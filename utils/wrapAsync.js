// function wrapAsync(fn){
//     return function(req,res,next){
//         fb(req,res,next).catch(next)
//     }
// }

module.exports = (fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next)
    }
}
