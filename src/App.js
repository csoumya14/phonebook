import React, { useState, useEffect } from "react";
import personService from "./services/persons";
import Person from "./components/Person";

const Filter = ({ searchString, handleSearchStringChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={searchString} onChange={handleSearchStringChange} />
    </div>
  );
};

const Form = ({
  addName,
  handleNameChange,
  handleNumberChange,
  newName,
  newNumber
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const NameList = ({ listNames }) => {
  console.log("In NameList", listNames());
  return <div>{listNames()}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then(initialPersons => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  }, []);
  //console.log("render", persons.length, "persons");

  const addName = event => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    };
    console.log("persons", persons);
    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    );
    if (existingPerson) {
      window.alert(`${newName} is already added to phonebook`);
    } else {
      personService.create(nameObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        console.log("In addName - in else branch - persons", persons);
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const listNames = () => {
    console.log("In listNames - Persons", persons);
    return persons.map(person => <Person person={person} key={person.id} />);
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleSearchStringChange = event => {
    setSearchString(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleSearchStringChange={handleSearchStringChange} />
      <h2>add a new</h2>
      <Form
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <NameList listNames={listNames} />
    </div>
  );
};

export default App;
