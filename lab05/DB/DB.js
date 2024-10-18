//const util = require('util')
const events = require('events')


let DB = {
    data: [
        {
            id: 1,
            name: 'Max',
            bday: '01.03.2000'
        },
        {
            id: 2,
            name: 'John',
            bday: '23.09.2001'
        },
        {
            id: 3,
            name: 'Mike',
            bday: '12.12.1998'
        },
    ],
    select: async function(){
        return this.data
    },
    insert: async function(obj){
        this.data.push(obj)
    },
    update: async function(newObj){
        this.data.forEach(el => {
            if(el.id == parseInt(newObj.id)){
                el.name = newObj.name
                el.bday = newObj.bday
            }
        });
    },
    delete: async function(id){
        this.data.forEach((el,index) => {
            if(el.id == id){
                return this.data.splice(index, 1)
            }
        })
    },
    commit: async function(){
        //console.log('commit')
    }
}

//util.inherits(DB, events.EventEmitter)
Object.assign(DB, events.prototype)

module.exports = DB

