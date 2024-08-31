const zod = require('zod')
const phoneRegx = /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/
// {message:"is required"}

const login = zod.object({
    email: zod.string({message:"Email I'd is required"}).email({message:"Please enter email I'd"}),
    password: zod.string({message:"Password is required"}).min(8,{message:"Password length is too short"})
})

const signUp = zod.object({
    username: zod.string({message:"User name is required"}).min(1,{message:"User name is too short"}),
    email: zod.string({message:"Email I'd is required"}).email({message:"Please enter valid email I'd"}),
    password: zod.string({message:"Password is required"}).min(8,{message:"Password length is too short"})
})

const addCustomer = zod.object({
    name:zod.string({message:"User name is required"}).min(1,{message:"User name is too short"}),
    phone_number: zod.string({message:"Phone number is required"}).regex(phoneRegx,{message:"Please enter valid phone number"}),
    organization: zod.string({message:"Organization is required"}).min(1,{message:"Organization name is too short"}),
    email: zod.string({message:"Email I'd is required"}).email({message:"Please enter valid email I'd"}),
})

const updateProfile = zod.object({
    username: zod.string({message:"Username is required"}).min(1,{message:"User name is too short"}),
    location: zod.string({message:"Location is required"}),
    standardPriceCow : zod.number({message:"Standard cow milk fat price is required"}).min(1,{message:"Standard price must be greater than 0"}),
    standardPriceBuffalo : zod.number({message:"Standard buffalo milk fat price is required"}).min(1,{message:"Standard price must be greater than 0"}),
})

const makeOrder = zod.object({
    organization: zod.string({message:"Organization is required"}).min(1,{message:"Organization name is too short"}),
    litre:zod.number({message:"litre is required"}).min(1,{message:"Enter valid litre"}),
    fat:zod.number({message:"fat is required"}).min(1,{message:"Enter valid fat"}),
    fat_price: zod.number({message:"fat_price is required"}).min(1,{message:"Enter valid fat price"}),
    amount: zod.number({message:"amount is required"}).min(1,{message:"Enter valid amount"}),
    advance_amount: zod.number({message:"amount is required"}).min(0, {message:"Enter valid advance amount"}),
    due_date: zod.string({message:"due date is required"}).date({message:"Enter valid date"}),
    when: zod.string({message:"When option is required"}).min(1,{message:"Enter Valid option morning or evening"}),
    which: zod.string({message:"Which option is required"}).min(1,{message:"Enter valid option cow or bufallow"})
})

const checkSingleFetchOrder = zod.object({
    organization: zod.string({message:"Organization is required"}).min(1,{message:"Organization name is too short"}),
    when: zod.string({message:"When option is required"}).min(1,{message:"Enter Valid option morning or evening"}),
    purchase_date: zod.string({message:"purchase date is required"}).date({message:"Enter valid date"}),
})

const checkPurchaseId = zod.object({
    purchaseId: zod.number({message:"Purchase Id is required"}).min(1)
})

const checkOrganization = zod.object({
    organization: zod.string({message:"Organization is required"}).min(1,{message:"Organization name is too short"}),
})

const purchaseUpdate = zod.object({
    purchaseId: zod.number({message:"Purchase Id is required"}).min(1),
    litre:zod.number({message:"litre is required"}).min(1,{message:"Enter valid litre"}),
    fat:zod.number({message:"fat is required"}).min(1,{message:"Enter valid fat"}),
    fat_price: zod.number({message:"fta price is required"}).min(1,{message:"Enter valid fat price"}),
    amount: zod.number({message:"amount is required"}).min(1,{message:"Enter valid amount"}),
    advance_amount: zod.number({message:"amount is required"}).min(0, {message:"Enter valid advance amount"}),
    due_date: zod.string({message:"due date is required"}).date({message:"Enter valid date"}),
    when: zod.string({message:"When option is required"}).min(1,{message:"Enter Valid option morning or evening"}),
    which: zod.string({message:"Which option is required"}).min(1,{message:"Enter valid option cow or bufallow"})
})

const checkAdvancedPayment = zod.object({
    organization: zod.string({message:"Organization is required"}).min(1,{message:"Organization name is too short"}),
    amount: zod.number({message:"Amount is required"}).min(1,{message:"Amount should be greater than zero"}),
})

module.exports = {
    signUp,
    login,
    makeOrder,
    checkPurchaseId,
    purchaseUpdate,
    updateProfile,
    checkOrganization,
    addCustomer,
    checkSingleFetchOrder,
    checkAdvancedPayment
}