import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import SignUp from './components/SignUp';
import ShowUser from './components/ShowUser';
import ShowFile from './components/ShowFile';

function App() {
  return (
    <>
      <Container fluid className="mainContainer">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route> 

          <Route exact path="/signup">
            <SignUp />
          </Route>

          <Route exact path="/users/:id">
            <ShowUser />
          </Route>

          <Route exact path="/files/:id">
            <ShowFile />
          </Route>
        </Switch>
      </Container>
    </>
  );
}

export default App;
