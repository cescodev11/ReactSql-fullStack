
module.exports = (sequelize, DataTypes) => { 
    const Posts = sequelize.define("Posts", { 
        title: {
            type: DataTypes.STRING, 
            allowNUll: false,
        },
        postText: {
            type: DataTypes.STRING, 
            allowNUll: false,
        },
        username: {
            type: DataTypes.STRING, 
            allowNUll: false,
        },

    })
    return Posts
}