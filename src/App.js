import {Component, useState} from 'react';
import {getFirestore, collection, query, where, doc, setDoc, addDoc, getDocs} from 'firebase/firestore';
import {FaCheck, FaPlus} from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { DropdownItem } from 'react-bootstrap';


export  default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {tasks: []};

    this.handleAddTasks = this.handleAddTasks.bind(this);
    this.handleCompleteTask = this.handleCompleteTask.bind(this);

}

  componentDidMount() {
    this.getData().then((res) => {
      this.setState({tasks: res});
    });
}

  async handleAddTasks(name) {

    const db   = getFirestore(this.props.firebaseApp);

    await addDoc(collection(db, "tasks"), {
      name: name,
      completed: false,
    });

    this.getData().then((res) => {
      this.setState({tasks: res});
    });
  }

  async handleCompleteTask(id) {
    const db = getFirestore(this.props.firebaseApp);

    await setDoc(doc(db, "tasks", id), {
      completed: true,
    }, {merge: true});

    this.getData().then((res) => {
      this.setState({tasks: res});
    });
  }

  async getData() {
    let t = [];
    const db = getFirestore(this.props.firebaseApp);
    const q = query(collection(db, "tasks"), where("completed", "==", false));
    const snap = await getDocs(q);

    let j = 0;
    await snap.docs.forEach((doc) => {
      t[j++] = {
        id: doc.id,
        name: doc.data().name,
      };
    });

    return t;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-xl-6 offset-xl-3">
            <div className={'text-center mt-3'}>
              <h1>Todo ReactJS</h1>
            </div>

            <hr/>

            <div className={'row mt-3'}>
                {this.state.tasks && this.state.tasks.map(task => (
                  <Task key={task.id} id={task.id} name={task.name} onComplete={this.handleCompleteTask}/>
                ))}
            </div>

            <div className={'mt-5'}>
              <Form handleAdd={this.handleAddTasks}/>
            </div>

            <hr/>

            <div className={'row mt-3'}>
              <DropDown title="Credits"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Task({id, name, onComplete}) {
  return (
    <div className={'col-12'} key={id}>
      <div className={'row mt-1 mb-1'}>
        <div className="col-10">
          {name}
        </div>

        <div className={'col-2 ms-auto'}>
          <button type="button" className={'btn btn-sm btn-primary'} onClick={() => onComplete(id)}>
            <FaCheck size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function Form({handleAdd}) {

  const [name, setName] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();

    handleAdd(name);
    setName('');
  };

  return (
    <form className="form" onSubmit={(e) => handleSubmit(e)}>
      <div className="row">
        <div className="col-8">
          <input className="form-control"
                 type="text"
                 value={name}
                 placeholder="Task name..."
                 onChange={(event) => {setName(event.target.value)}}/>
        </div>
        <div className="col-3 ms-auto">
          <button type="submit"
                  className={'btn btn-primary'}
                  disabled={name === ''}><FaPlus size={12}/>&nbsp;Add</button>
        </div>
      </div>
    </form>
  );
}

function DropDown() {
  return (
    <DropdownButton id="dropdown-item-button" title="Credits">
      <Dropdown.ItemText>Name: Ostein Vittorio Vellim</Dropdown.ItemText>
      <Dropdown.ItemText>ID: 2602206783</Dropdown.ItemText>
      <Dropdown.ItemText>Source: Code with Ross on YouTube</Dropdown.ItemText>
      <Dropdown.Item as={DropdownItem} href="https://www.youtube.com/watch?v=88uQj9Ynzc4&pp=ygUdcmVhY3QganMgdG8gZG8gbGlzdCA4IG1pbnV0ZXM%3D">
        View on YouTube
      </Dropdown.Item>
    </DropdownButton>
  );
}
