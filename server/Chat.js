const students = [];

const addStudent = ({id, name, room}) =>{

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingStudent = students.find((student) => student.room === room && student.name === name);

    if(existingStudent){
        return{error:'Username is already take!!'}
    }

    const student   = {id, name, room};

    students.push(student)

    return {student}
}
const removeStudent = (id) =>{
    const index  = students.findIndex((student) => student.id == id);

    if(index !== -1){
        return students.splice(index, 1)[0];
    }
    
}
const getStudent = (id) => students.find((student) => student.id === id)
const getStudentInRoom = (room) => students.filter((students) => student.room === room)



module.exports = {addStudent, removeStudent, getStudent, getStudentInRoom};