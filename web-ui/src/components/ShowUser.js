import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory } from 'react-router-dom';

import { Button, Row, Col, Form } from 'react-bootstrap';

import { show_user, all_invites, create_file, delete_user, update_user, create_invite, delete_file } from '../api';

import { connect } from 'react-redux';

import store from './../store';

function ShowFiles({ user, setUser, invites, owner }) {
    const history = useHistory();

    const [pSearch, setPSearch] = useState("");
    const [iSearch, setISearch] = useState("");

    const [pLanguage, setPLanguage] = useState('0');
    const [iLanguage, setILanguage] = useState('0');

    const [togglePSearch, setTogglePSearch] = useState(false);
    const [toggleISearch, setToggleISearch] = useState(false);

    const [files, setFiles] = useState(user.files);
    const [invitesFiltered, setInvitesFiltered] = useState(invites);

    useEffect(() => {
        if (togglePSearch) {
            setFiles(user.files.filter((f) => {
                let s1 = f.name.toUpperCase();
                let search = pSearch.toUpperCase();
                if (pLanguage === '0') {
                    return s1.includes(search);
                } else {
                    return s1.includes(search) && (f.language == pLanguage);
                }
            }))
        } else {
            setFiles(user.files);
        }
    }, [user.files, pSearch, togglePSearch, pLanguage]);

    useEffect(() => {
        setInvitesFiltered(invites.filter((i) => {
            let s1 = i.file.name.toUpperCase();
            let search = iSearch.toUpperCase();
            if (iLanguage === '0') {
                return s1.includes(search) && !(user.files.some((f) => f.id === i.file.id));
            } else {
                return s1.includes(search) && (i.file.language == iLanguage) && !(user.files.some((f) => f.id === i.file.id));
            }
        }));
    }, [invites, iSearch, toggleISearch, iLanguage, user.email]);

    const d = {
        71: "Python",
        83: "Swift",
        63: "JavaScript",
        62: "Java",
        50: "C",
        54: "C++",
        57: "Elixir",
        69: "Prolog",
        72: "Ruby"
    };

    function deleteFile(file_id, user_id) {
        delete_file(file_id).then(()=>{
            show_user(user_id).then((resp) => {
                resp.files.sort(compareFiles);
                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "files": resp.files
                })
            })
        })
    }

    return (
        <Row style={{paddingTop: "20px"}}>
            <Col sm={6} style={{overflow: 'visible'}}>
                <div className="flex-row center space-between" style={{padding: "20px 10px"}}>
                    <h1>Personal Files</h1>
                    { togglePSearch ?
                        <div className="closeIcon" onClick={() => {setTogglePSearch(false); setPSearch(""); setPLanguage('0')}}></div>
                        :
                        <div className="searchIcon" onClick={() => {setTogglePSearch(true)}}></div>
                    }
                </div>
                { togglePSearch ? 
                    <Form autoComplete="new-password" className='box inset' style={{padding: '10px', marginTop: '-10px', marginBottom: '20px'}}>
                        <div className="flex-row space-between">
                            <Form.Group style={{width: '45%', margin: '0px'}}>
                                <Form.Control autoComplete="unsupportedrandom" className="dark-form green" type="text" value={pSearch} placeholder="Search by name" onChange={(ev) => {setPSearch(ev.target.value)}} />
                            </Form.Group>
                            <Form.Group style={{width: '45%', margin: '0px'}}>
                                <Form.Control className="dark-form green" as="select" value={pLanguage} onChange={(ev) => {setPLanguage(ev.target.value)}}>
                                    <option value={0}>Filter Language</option>
                                    <option value={50}>C (GCC 9.2.0)</option>
                                    <option value={54}>C++ (GCC 9.2.0)</option>
                                    <option value={57}>Elixir</option>
                                    <option value={62}>Java 13</option>
                                    <option value={63}>JavaScript 12.14</option>
                                    <option value={69}>Prolog (GNU 1.4.5)</option>
                                    <option value={71}>Python 3</option>
                                    <option value={72}>Ruby 2.7</option>
                                    <option value={83}>Swift 5</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </Form>
                    :
                    <></>
                }
                {
                    files.length === 0 ?
                        <div className="fileDisplay">
                            <p>No files found</p>
                        </div>
                    :
                    files.map((f) => {
                        return (
                            <div className={`fileDisplay clickable ${owner ? 'owner' : ''}`} key={f.id} onClick={() => {history.push(`/files/${f.id}`)}}>
                                <div className="flex-row space-between" style={{overflow: 'visible'}}>
                                    <p className="fileDisplayText">{f.name}</p>
                                    { owner ?
                                        <>
                                            <p className="fileDisplayLanguage">{d[f.language]}</p>
                                            <Button className="fileDisplayDelete" variant="outline-danger" onClick={(ev) => {ev.stopPropagation(); deleteFile(f.id, user.user_id);}} value={f.id}>Delete</Button>
                                        </>
                                        :
                                        <p className="fileDisplayLanguage">{d[f.language]}</p>
                                    }
                                </div>
                            </div>
                        )
                    })    
                }
            </Col>
            <Col sm={6}>
                <div className="flex-row center space-between" style={{padding: "20px 10px"}}>
                    <h1>Invited To</h1>
                    { toggleISearch ?
                        <div className="closeIcon" onClick={() => {setToggleISearch(false); setISearch(""); setILanguage('0')}}></div>
                        :
                        <div className="searchIcon" onClick={() => {setToggleISearch(true)}}></div>
                    }
                </div>
                { toggleISearch ? 
                    <Form autoComplete="new-password" className='box inset' style={{padding: '10px', marginTop: '-10px', marginBottom: '20px'}}>
                        <div className="flex-row space-between">
                            <Form.Group style={{width: '45%', margin: '0px'}}>
                                <Form.Control autoComplete="unsupportedrandom" className="dark-form green" type="text" value={iSearch} placeholder="Search by name" onChange={(ev) => {setISearch(ev.target.value)}} />
                            </Form.Group>
                            <Form.Group style={{width: '45%', margin: '0px'}}>
                                <Form.Control className="dark-form green" as="select" value={iLanguage} onChange={(ev) => {setILanguage(ev.target.value)}}>
                                    <option value={0}>Filter Language</option>
                                    <option value={50}>C (GCC 9.2.0)</option>
                                    <option value={54}>C++ (GCC 9.2.0)</option>
                                    <option value={57}>Elixir</option>
                                    <option value={62}>Java 13</option>
                                    <option value={63}>JavaScript 12.14</option>
                                    <option value={69}>Prolog (GNU 1.4.5)</option>
                                    <option value={71}>Python 3</option>
                                    <option value={72}>Ruby 2.7</option>
                                    <option value={83}>Swift 5</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </Form>
                    :
                    <></>
                }
                {
                    invitesFiltered.length === 0 ?
                        <div className="fileDisplay">
                            <p>No files found</p>
                        </div>
                    :
                    invitesFiltered.map((i) => {
                        return (
                            <div className="fileDisplay clickable" key={i.file.id} onClick={(ev) => {history.push(`/files/${i.file.id}`)}}>
                                <div className="flex-row space-between">
                                    <p className="fileDisplayText">{i.file.name}</p>
                                    <p>{d[i.file.language]}</p>
                                </div>
                            </div>
                        )
                    })    
                }
            </Col>
        </Row>
    )
}

const compareInvites = (a, b) => {
    var nameA = a.file.name.toUpperCase();
    var nameB = b.file.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    return 0;
}

const compareFiles = (a, b) => {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    return 0;
}

function ShowOther({ id }) {

    const [found, setFound] = useState(true);
    const [user, setUser] = useState({
        "name": "",
        "email": "",
        "files": [],
        "user_id": id
    });

    const [invites, setInvites] = useState([]);

    useEffect(() => {
        show_user(id)
            .then((resp) => {

                resp.files.sort(compareFiles);

                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "files": resp.files,
                    "user_id": id
                })
            })
            .catch((e) => {
                setFound(false);
            })
            .finally(
                all_invites()
                    .then((resp) => {
                        let respFiltered = resp.filter((i) => i.email === user.email);
                        respFiltered.sort(compareInvites);
                        setInvites(respFiltered);
                    })
            );
    }, [id, user.email]);

    return (
        <div className="windowSize padding" style={{overflow: 'scroll'}}>
            <Row>
                <HomeIcon style={{marginBottom: '40px'}} />
            </Row>
            <Row style={{padding: '15px 0px'}}>  
                <Col> 
                    { found ?
                        <div className="flex-column end" style={{width: '100%', overflow: 'visible'}}>
                            <div className="flex-column end box" style={{width: 'auto', minWidth: '400px'}}>
                                <h1 className="username">{user.name}</h1>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        :
                        <div className="flex-column end" style={{width: '100%', overflow: 'visible'}}>
                            <div className="flex-column end box" style={{width: 'auto'}}>
                                <h1 className="username">Not Found</h1>
                                <p>unkown@email.com</p>
                            </div>
                        </div>
                    }
                </Col>
            </Row>
            <ShowFiles user={user} setUser={null} invites={invites} owner={false}/>
        </div>
    )
}

function EditForm({ session, setEdit, edit, parentUser }) {
    const history = useHistory();

    const [user, setUser] = useState({
        'name': parentUser.name,
        'email': parentUser.email,
    });

    const [errors, setErrors] = useState({
        'name': null,
        'email': null,
    });

    function onSubmit(ev) {
        ev.preventDefault();

        if (user.name.length >= 10) {
            let newErrors = Object.assign({}, errors);
            newErrors['name'] = 'Name must be 10 characters or less';
            setErrors(newErrors);
            return
        }
        update_user(session.user_id, {
            id: session.user_id,
            user: user
        }).then((resp) => {
            if (resp.errors) {
                let newErrors = Object.assign({}, errors);
                if (resp.errors.name) {
                    newErrors['name'] = resp.errors.name[0];
                } else {
                    newErrors['name'] = "";
                }
                
                if (resp.errors.email) {
                    newErrors['email'] = resp.errors.email[0];
                } else {
                    newErrors['email'] = "";
                }

                setErrors(newErrors);
            } else {
                history.go(0);
            }
        });
    }

    function deleteAccount(ev) {
        delete_user(session.user_id).then((resp) => {
            store.dispatch({type: 'session/clear'});
            history.push("/");
        })
    }

    function updateName(ev) {
        let newUser = Object.assign({}, user);
        newUser["name"] = ev.target.value;
        setUser(newUser);
    }

    function updateEmail(ev) {
        let newUser = Object.assign({}, user);
        newUser["email"] = ev.target.value;
        setUser(newUser);
    }

    return (
        <Form autoComplete="new-password" style={{width: "100%", height: "100%", overflow: 'visible'}} onSubmit={onSubmit}>
            <div className="flex-column space-between" style={{height: '100%'}}>
            <h1>Edit Profile</h1>
            <Row>
                <Col style={{paddingLeft: '0px'}}>
                    <Form.Group>
                        <Form.Label>Name<span className="text-danger">{errors.name ? ` - ${errors.name}` : null }</span></Form.Label>
                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="text" onChange={updateName} value={user.name} placeholder="Enter name" />
                    </Form.Group>
                </Col>
                <Col style={{paddingRight: '0px'}}>
                    <Form.Group>
                        <Form.Label>Email<span className="text-danger">{errors.email ? ` - ${errors.email}` : null }</span></Form.Label>
                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="email" onChange={updateEmail} value={user.email} placeholder="Enter email" />
                    </Form.Group>
                </Col>
            </Row>

            <div className="flex-row space-between" style={{overflow: 'visible'}}>
                <Button variant="outline-light" className="tripleButton" onClick={() => {setEdit(!edit)}}>Cancel</Button>
                <Button variant="outline-danger" className="tripleButton" onClick={deleteAccount}>Delete Acct</Button>
                <Button variant="outline-success" className="tripleButton" type="submit">Save Changes</Button>
            </div>
            </div>
        </Form>
    )
}


function ShowYourself({ session }) {
    const history = useHistory();

    const [edit, setEdit] = useState(false);

    const [user, setUser] = useState({
        "name": "",
        "email": "",
        "files": [],
        "user_id": session.user_id
    });

    const [file, setFile] = useState({
        "name": "",
        "language": 50,
        "description": "",
        "body": "",
        "user_id": session.user_id
    })

    const [error, setError] = useState(false);

    const [invites, setInvites] = useState([]);

    useEffect(() => {
        show_user(session.user_id)
            .then((resp) => {
                resp.files.sort(compareFiles);
                setUser({
                    "name": resp.name,
                    "email": resp.email,
                    "files": resp.files,
                    "user_id": session.user_id
                })
            })
            .finally(
                all_invites()
                    .then((resp) => {
                        let respFiltered = resp.filter((i) => i.email === user.email)
                        respFiltered.sort(compareInvites)
                        setInvites(respFiltered);                    
                    })
            );
    }, [session.user_id, user.email]);

    function logout() {
        store.dispatch({type: 'session/clear'});
        history.push("/");
    }

    function updateFileName(ev) {
        let newFile = Object.assign({}, file);
        newFile["name"] = ev.target.value;
        setFile(newFile);
    }

    function updateLanguage(ev) {
        let newFile = Object.assign({}, file);
        newFile["language"] = ev.target.value;
        setFile(newFile);
    }

    function createFile(ev) {
        ev.preventDefault();

        create_file(file).then((resp) => {
            if (resp.errors) {
                setError(true);
            } else {
                setError(false);
                create_invite({
                    'email': session.email,
                    'file_id': resp.data.id
                });
                history.push(`/files/${resp.data.id}`);
            }
        });
    }

    return (
        <div className="windowSize padding" style={{overflow: 'scroll'}}>
            <Row>
                <HomeIcon style={{marginBottom: '40px'}} />
            </Row>
            <Row style={{padding: "15px 0px"}}>
                <Col sm={6}>
                    <div className="flex-column box" style={{width: '100%', height: 'calc(100% - 20px)', overflow: 'visible'}}>
                        <Form style={{height: '100%'}} onSubmit={createFile}>
                            <Form.Group className="flex-column space-between" style={{height: '100%'}}>
                                <Row>
                                    <Col>
                                        <Form.Label>Create New File</Form.Label>
                                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="text" onChange={updateFileName} value={file.name} placeholder="Name" />
                                    </Col>
                                </Row>
                                
                                <Row style={{overflow: 'visible'}}>
                                    <Col xs={8}>
                                        <Form.Label>Language</Form.Label>
                                        <Form.Control className="dark-form" as="select" value={file.language} onChange={updateLanguage}>
                                            <option value={50}>C (GCC 9.2.0)</option>
                                            <option value={54}>C++ (GCC 9.2.0)</option>
                                            <option value={57}>Elixir</option>
                                            <option value={62}>Java 13</option>
                                            <option value={63}>JavaScript 12.14</option>
                                            <option value={69}>Prolog (GNU 1.4.5)</option>
                                            <option value={71}>Python 3</option>
                                            <option value={72}>Ruby 2.7</option>
                                            <option value={83}>Swift 5</option>
                                        </Form.Control>
                                    </Col>

                                    <Col xs={4} style={{overflow: 'visible'}}>
                                        <Button variant="outline-success" style={{position: 'relative', width: '100%', top: '100%', transform: 'translateY(-100%)'}} type="submit">Create</Button>
                                    </Col>
                                </Row>
                                { error ? 
                                    <Row>
                                        <Col>
                                            <Form.Text className="text-danger">Name can't be blank</Form.Text>
                                        </Col>
                                    </Row>
                                :
                                    <></>
                                }
                            </Form.Group>
                        </Form>
                        
                    </div>
                </Col>
                <Col sm={6}>
                    {   !edit ?
                        <div className="flex-column end box" style={{width: '100%', overflow: 'visible'}}>
                            <h1 className="personalUsername">{user.name}</h1>
                            <p>{user.email}</p>
    
                            <div className="flex-row end" style={{overflow: 'visible'}}>
                                <Button variant="outline-light" className="profileButton" onClick={() => {setEdit(!edit)}}>Edit Profile</Button>
                                <Button variant="outline-danger" className="profileButton" onClick={logout}>Logout</Button>
                            </div>
                        </div>
                        :
                        <div className="flex-column end box inset" style={{width: '100%', height: '247px',overflow: 'visible'}}>
                            <EditForm session={session} setEdit={setEdit} edit={edit} parentUser={user}/>
                        </div>
                    }
                </Col>
            </Row>
            <Row>
                
            </Row>
            <ShowFiles user={user} setUser={setUser} invites={invites} owner={true}/>
        </div>
    )
}

function ShowUser({session}) {
    const { id } = useParams();

    if (session) {
        return (session.user_id == id ? <ShowYourself session={session} /> : <ShowOther id={id} />);
    } else {
        return <ShowOther id={id} />
    }
}

export default connect(({session}) => ({session}))(ShowUser);