// // const Header = () => {
// //         return (
// //         <header style={{ backgroundColor: 'green', color: 'white', padding: '1rem' }}>
// //         <h1>This is the Header</h1>
// //         </header>
// //         );
// // };

// // const Body = () => {
// //         return (
// //         <main style={{ backgroundColor: 'red', color: 'white', padding: '1rem' }}>
// //         <p>This is the Body section</p>
// //         </main>
// //         );
// // };

// // const Footer = () => {
// //         return (
// //         <footer style={{ backgroundColor: 'yellow', color: 'black', padding: '1rem' }}>
// //         <p>This is the Footer</p>
// //         </footer>
// //         );
// // };

// // const App = () => {
// //         return (
// //         <div>
// //                 <Header />
// //                 <Body />
// //                 <Footer />
// //         </div>
// //         );
// // };

// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(<App />);

// const Todo1 = () => {
//         const todo = {
//                 id: 1,
//                 title: "Buy groceries",
//                 isCompleted: false
//         };

//         return (
//         <div>
//         <h3>#{todo.id}: {todo.title}</h3>
//         <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
//         <hr />
//         </div>
//         );
// };

// const Todo2 = () => {
//         const todo = {
//         id: 2,
//         title: "Do homework",
//         isCompleted: true
//         };

//         return (
//         <div>
//         <h3>#{todo.id}: {todo.title}</h3>
//         <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
//         <hr />
//         </div>
//         );
// };

// const Todo3 = () => {
//         const todo = {
//         id: 3,
//         title: "Call mom",
//         isCompleted: false
//         };

//         return (
//         <div>
//         <h3>#{todo.id}: {todo.title}</h3>
//         <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
//         <hr />
//         </div>
//         );
// };

// const Todo4 = () => {
//         const todo = {
//         id: 4,
//         title: "Walk the dog",
//         isCompleted: true
//         };

//         return (
//         <div>
//         <h3>#{todo.id}: {todo.title}</h3>
//         <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
//         <hr />
//         </div>
//         );
// };

// const Todo5 = () => {
//         const todo = {
//         id: 5,
//         title: "Read a book",
//         isCompleted: false
//         };

//         return (
//         <div>
//         <h3>#{todo.id}: {todo.title}</h3>
//         <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
//         <hr />
//         </div>
//         );
// };

// const App = () => {
//         return (
//         <div>
//         <h2>My Todo List</h2>
//         <Todo1 />
//         <Todo2 />
//         <Todo3 />
//         <Todo4 />
//         <Todo5 />
//         </div>
//         );
// };

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);


import React from 'react';
const mentor = [
  {
    name: 'Samarth',
    students: ['Bhushan', 'Krish'],
  },
  {
    name: 'Anshika',
    students: ['Anshika']
  }
];

const MentComp = () => {
  return (
    <div>
      <h1>Mentor & Student</h1>{
        mentor.map((mentor, index) => {
          return (
            <div>
              <p>{mentor.name}</p>
              <ul>{mentor.students.map((students, idx) => {
                return (
                  <li key={idx}>{students}</li>
                )
              })}</ul>
            </div>
          )
        })
      }
      
    </div>
  )
}