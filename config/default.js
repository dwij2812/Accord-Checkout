module.exports = {
    port: 3000,
    session: {
        secret: 'inventoryManagemengtSys',
        key: 'inventorySys',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/inventory_system_test'
}