const zod = require('zod')
const phoneRegx = /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/

const login = zod.object({
    email: zod.string().email({message:"Please enter email I'd"}),
    password: zod.string().min(8,{message:"Password length is too short"})
})

const signUp = zod.object({
    username: zod.string().min(1,{message:"User name is required"}),
    email: zod.string().email({message:"Please enter valid email I'd"}),
    password: zod.string().min(8,{message:"Password length is too short"})
})

const updateProfile = zod.object({
    username: zod.string().min(1,{message:"User name is required"}),
    location: zod.string(),
    standardPrice : zod.number({message:"Standard price is required"}).min(1,{message:"Standard price must be greater than 0"}),
})

const makeOrder = zod.object({
    customer_name: zod.string().min(1,{message:"Customer name is required"}),
    phone_number: zod.string().regex(phoneRegx,{message:"Please enter valid phone number"}),
    organization: zod.string().min(1,{message:"Organization is required"}),
    email: zod.string().email({message:"Please enter valid email I'd"}),
    litre:zod.number().min(1,{message:"Enter valid litre"}),
    fat:zod.number().min(1,{message:"Enter valid fat"}),
    fat_price: zod.number().min(1,{message:"Enter valid fat price"}),
    discount: zod.number({message:"Discount should be a number"}),
    amount: zod.number().min(1,{message:"Enter valid amount"}),
    due_date: zod.string().date({message:"Enter valid date"}),
    remainder_type:zod.string().min(1,{message:"Enter valid remainder type"}),
    additional_notes: zod.string(),
})

const checkPurchaseId = zod.object({
    purchaseId: zod.number({message:"Purchase Id is required"}).min(1)
})

const checkOrganization = zod.object({
    organization: zod.string().min(1,{message:"Organization is required"})
})

const purchaseUpdate = zod.object({
    purchaseId: zod.number({message:"Purchase Id is required"}).min(1),
    customerId: zod.number({message:"Customer Id is required"}).min(1),
    customer_name: zod.string().min(1,{message:"Customer name is required"}),
    phone_number: zod.string().regex(phoneRegx,{message:"Please enter valid phone number"}),
    organization: zod.string().min(1,{message:"Organization is required"}),
    email: zod.string().email({message:"Please enter valid email I'd"}),
    litre:zod.number().min(1,{message:"Enter valid litre"}),
    fat:zod.number().min(1,{message:"Enter valid fat"}),
    fat_price: zod.number().min(1,{message:"Enter valid fat price"}),
    discount: zod.number({message:"Discount should be a number"}),
    amount: zod.number().min(1,{message:"Enter valid amount"}),
    due_date: zod.string().date({message:"Enter valid date"}),
    remainder_type:zod.string().min(1,{message:"Enter valid remainder type"}),
    additional_notes: zod.string(),
})

module.exports = {
    signUp,
    login,
    makeOrder,
    checkPurchaseId,
    purchaseUpdate,
    updateProfile,
    checkOrganization
}