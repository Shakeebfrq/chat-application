const users = [];
const moment = require('moment')
const newUser =  (id,username,room)=>{
    const user = {id,username,room};
    users.push(user);
    return user;
};

const formatMessage = (username,text)=>({
    username,
    text,
    time: moment().format('h:mn a')
});

const getIndividualUsers = room =>{
   return users.filter(user=>user.room===room);
}
const getActiveUser= id => {
    return users.find(user=>user.id===id);
};

const exitRoom = id =>{
    const index = users.findIndex(user=>user.id==id);
  return  users.splice(index,1) [0];
};

module.exports=  {
    newUser,
    formatMessage,
    getIndividualUsers,
    getActiveUser,
    exitRoom
}