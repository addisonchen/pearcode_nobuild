import { useState, useEffect } from 'react'

import HomeIcon from './HomeIcon';

import { useParams, useHistory } from 'react-router-dom';

import { Button, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

import { api_login, show_file, update_file, delete_invite, create_invite, delete_comment, create_comment, delete_file, create_user } from '../api';

import { ch_join, ch_update, ch_leave, ch_stop_typing, ch_execute, ch_language } from '../socket.js'

import "ace-builds";
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";


// language imports
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-prolog";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-swift";

import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-min-noconflict/ext-language_tools";

import { connect } from 'react-redux';

function Login({ id, file }) {

    const history = useHistory();

    const [toggle, setToggle] = useState([false, false, false]);

    const [loginInfo, setLoginInfo] = useState({
        'email': '',
        'password': ''
    })

    const [loginError, setLoginError] = useState(false);

    const [user, setUser] = useState({
        'name': "",
        'email': "",
        'password': ""
    });

    const [errors, setErrors] = useState({
        'name': null,
        'email': null,
        'password': null
    })
    
    function submitLogin(ev) {
        ev.preventDefault();
        api_login(loginInfo.email, loginInfo.password).then((res) => {
            if (res) {
                setLoginError(false);
                history.push(`/files/${id}`);
                ch_leave();
            } else {
                setLoginError(true);
            }
        });
    }

    function toggleBox(idx) {
        let t1 = [...toggle];
        t1[idx] = !t1[idx];
        setToggle(t1);
    }

    function updateLoginEmail(ev) {
        let l1 = Object.assign({}, loginInfo);
        l1['email'] = ev.target.value;
        setLoginInfo(l1);
    }

    function updateLoginPassword(ev) {
        let l1 = Object.assign({}, loginInfo);
        l1['password'] = ev.target.value;
        setLoginInfo(l1);
    }

    function submitSignUp(ev) {
        ev.preventDefault();

        if (user.password.length < 8) {
            let newErrors = {
                'name': null,
                'email': null,
                'password': null
            }
            newErrors['password'] = 'password must be 8 characters or longer';
            setErrors(newErrors);
            return
        }

        if (user.name.length >= 10) {
            let newErrors = {
                'name': null,
                'email': null,
                'password': null
            }
            newErrors['name'] = 'Name must be 10 characters or less';
            setErrors(newErrors);
            return
        }

        create_user(user).then((resp) => {
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

                if (resp.errors.password) {
                    newErrors['password'] = resp.errors.password[0];
                } else {
                    newErrors['password'] = "";
                }
                setErrors(newErrors);
            } else {
                api_login(user.email, user.password).then((res) => {
                    if (res) {
                        history.push(`/files/${id}`);
                        ch_leave();
                    }
                })
            }
        });
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

    function updatePassword(ev) {
        let newUser = Object.assign({}, user);
        newUser["password"] = ev.target.value;
        setUser(newUser);
    }

    return (
        <div className="socialInfoContainer padding">
            <div style={{minHeight: '85px', width: '100%'}}>
                <h1 className="fileNameText">{file.name}</h1>
                <p className="text-muted">Owner: <span className="hoverGreen" style={{cursor: 'pointer'}} onClick={() => {history.push(`/users/${file.user_id}`); ch_leave();}}>{file.user_email}</span></p>
            </div>
            
            <div className={`box slimPadding boxHeadingContainer ${toggle[0] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(0)}}>
                    <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading`}>Description</h5>
                    { toggle[0] ?
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>-</h5>
                        :
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>+</h5>
                    }
                </div>
                <div style={{height: '10px'}}></div>
                
                <div className="text-muted insetBorder" style={{height: '150px', overflowY: 'scroll', wordWrap: 'break-word'}}>{file.description ? file.description : 'None'}</div>
            </div>

            <div className={`box slimPadding boxHeadingContainer ${toggle[1] ? '' : 'closed'}`}  style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(1)}}>
                    <h5 className="toggleBoxHeading green">Login</h5>
                    { toggle[1] ?
                        <h5 className="toggleBoxHeading dSign ">-</h5>
                        :
                        <h5 className="toggleBoxHeading dSign">+</h5>
                    }
                </div>
                <div style={{height: '10px'}}></div>
                <Form onSubmit={submitLogin} autoComplete="new-password" style={{marginBottom: '10px', overflow: 'visible'}}>
                    <Form.Group>
                        <Form.Text className="text-muted">Email</Form.Text>
                        <Form.Control type="email" placeholder="Enter Email"  autoComplete="unsupportedrandom" className="dark-form" onChange={updateLoginEmail} value={loginInfo.email} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Text className="text-muted">Password</Form.Text>
                        <Form.Control type="password" placeholder="Enter Password"  autoComplete="unsupportedrandom" className="dark-form" onChange={updateLoginPassword} value={loginInfo.password} />
                    </Form.Group>
                    <div className="flex-row center space-between" style={{overflow: 'visible'}}>
                        { loginError ?
                            <Form.Text className="text-danger">Invalid email or password</Form.Text>
                            :
                            <div></div>
                        }
                        <Button type="submit" variant="outline-success">Login</Button>
                    </div>
                </Form>
            </div>

            <div className={`box slimPadding boxHeadingContainer ${toggle[2] ? '' : 'closed'}`}  style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(2)}}>
                    <h5 className="toggleBoxHeading green">Sign Up</h5>
                    { toggle[2] ?
                        <h5 className="toggleBoxHeading dSign">-</h5>
                        :
                        <h5 className="toggleBoxHeading dSign">+</h5>
                    }
                </div>
                <div style={{height: '10px'}}></div>
                <Form onSubmit={submitSignUp} autoComplete="new-password" style={{marginBottom: '10px', overflow: 'visible'}}>
                    <Form.Group>
                        <Form.Text className="text-muted">Name</Form.Text>
                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="text" onChange={updateName} value={user.name} placeholder="Enter name" />
                        { errors.name ? 
                            <Form.Text className="text-danger">{errors.name}</Form.Text>
                        :
                            <></>
                        }
                    </Form.Group>

                    <Form.Group>
                        <Form.Text className="text-muted">Email</Form.Text>
                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="email" onChange={updateEmail} value={user.email} placeholder="Enter email" />
                        { errors.email ? 
                            <Form.Text className="text-danger">{errors.email}</Form.Text>
                        :
                            <></>
                        }
                    </Form.Group>

                    <Form.Group>
                        <Form.Text className="text-muted">Password</Form.Text>
                        <Form.Control autoComplete="unsupportedrandom" className="dark-form" type="password" onChange={updatePassword} value={user.password} placeholder="Choose a password" />
                        { errors.password ? 
                            <Form.Text className="text-danger">{errors.password}</Form.Text>
                        :
                            <></>
                        }
                    </Form.Group>
                    
                    <div className="flex-row end" style={{overflow: 'visible'}}>
                        <Button variant="outline-success" type="submit">
                            Sign Up
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )

}

function NoSession({ id, language }) {

    const history = useHistory();


    return (
        <div className="editorInfoContainer padding">
            <div style={{minHeight: '45px', width: '100%'}}>
                <div className="flex-row center space-between" style={{width: '100%', overflow: 'visible', minHeight: '38px'}}>
                    <Button variant="outline-info" onClick={() => {history.push('/signup'); ch_leave();}} style={{textOverflow: 'clip', whiteSpace: 'nowrap'}}>Login | Sign Up</Button>
                    <h1 className="headingEmoji" onClick={() => {history.push('/'); ch_leave();}}>🍐</h1>
                </div>
            </div>

            <div className="box inset slimPadding">
                <div className="flex-row center space-between" style={{width: '100%', padding: '0px 20px', overflow: 'visible'}}>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Not logged in</Tooltip>}>
                        <h1 className="headingEmoji small disabled">💾</h1>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Not logged in</Tooltip>}>
                        <h1 className="headingEmoji small disabled">📎</h1>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Not logged in</Tooltip>}>
                        <h1 className="headingEmoji small disabled">🖨️</h1>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Not Logged in</Tooltip>}>
                        <h1 className="headingEmoji small disabled">🗑️</h1>
                    </OverlayTrigger>
                </div>
            </div>

            <div className="box slimPadding flex-column boxHeadingContainer" style={{margin: '10px 0px'}}>
                <Form.Control disabled className="dark-form muted" as="select" value={language}>
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
            </div>

            <div className="box slimPadding" style={{margin: '10px 0px'}}>
                <p className="text-danger" style={{fontSize: '.9em'}}>Log in to or create an invited account to modify and run this file</p>
            </div>

        </div>
    )
}

function EditorInfo({ session, file, language, setLanguage, save, body, participants, result, executing, connected }) {
    const history = useHistory();

    const fileOwner = session.user_id === file.user_id;

    const copyLink = `https://pearcode.swoogity.com/files/${file.id}`;

    const [toggle, setToggle] = useState([false, false]);

    function toggleBox(idx) {
        let t1 = [...toggle];
        t1[idx] = !t1[idx];
        setToggle(t1);
    }

    function downloadFile(name) {
        let map = {
            50: '.c',
            54: '.cpp',
            57: '.ex',
            62: '.java',
            63: '.js',
            69: '.pl',
            71: '.py',
            72: '.rb',
            83: '.swift'
        }
        let ext = map[language]
        const element = document.createElement("a");
        const file = new Blob([body], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${name}${ext}`;
        document.body.appendChild(element);
        element.click();
    }

    function deleteFile(id) {
        delete_file(id).then(()=>{
            console.log('fix deleting when others are viewing!');
            history.push(`/users/${session.user_id}`);
            ch_leave();
        })
    }

    function doExecute() {
        if (!executing) {
            let t1 = [...toggle];
            t1[1] = true;
            setToggle(t1);
            ch_execute(parseInt(language));
        }
    }

    return (
        <div className="editorInfoContainer padding">
            <div style={{minHeight: '45px', width: '100%', overflow: 'visible'}}>
                <div className="flex-row center space-between" style={{width: '100%', overflow: 'visible', minHeight: '38px'}}>
                    <Button variant="outline-info" onClick={() => {history.push(`/users/${session.user_id}`); ch_leave();}} style={{textOverflow: 'clip', whiteSpace: 'nowrap'}}>Your Profile</Button>
                    <h1 className="headingEmoji" onClick={() => {history.push('/'); ch_leave();}}>🍐</h1>
                </div>
            </div>
            
            { fileOwner ?
                <div className="box inset slimPadding">
                    <div className="flex-row center space-between" style={{width: '100%', padding: '0px 20px', overflow: 'visible'}}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Save</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {save()}}>💾</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Copy Link</Tooltip>}>
                            <h1 className="headingEmoji small">📎</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Download File</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {downloadFile(file.name)}}>🖨️</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete File</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {deleteFile(file.id)}}>🗑️</h1>
                        </OverlayTrigger>
                    </div>
                </div>
            :
                <div className="box inset slimPadding">
                    <div className="flex-row center space-between" style={{width: '100%', padding: '0px 20px', overflow: 'visible'}}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Not file owner</Tooltip>}>
                            <h1 className="headingEmoji small disabled">💾</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Copy Link</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {navigator.clipboard.writeText(copyLink)}}>📎</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Download File</Tooltip>}>
                            <h1 className="headingEmoji small" onClick={() => {downloadFile(file.name)}}>🖨️</h1>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Not file owner</Tooltip>}>
                            <h1 className="headingEmoji small disabled">🗑️</h1>
                        </OverlayTrigger>
                    </div>
                </div>
            }

            <div className="box slimPadding flex-column boxHeadingContainer" style={{margin: '10px 0px', minHeight: '106px'}}>
                { connected === 0 ?
                    <div className="flex-column centercenter" style={{width: '100%', height: '100%'}}>
                        <div className="spinner"></div>
                        <div style={{height: '10px'}}></div>
                        <p>connecting...</p>
                    </div>
                    :
                        connected === 1 ?
                            <>
                                <Form.Control className="dark-form muted" as="select" value={language} onChange={(ev) => {setLanguage(ev.target.value); ch_language(ev.target.value);}}>
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
                                <div style={{height: '10px'}}></div>
                                <Button variant={executing ? "outline-warning" : "outline-info"} onClick={doExecute} style={{minHeight: '38px'}}>
                                    { executing ? 
                                        <div className="flex-row centercenter" style={{width: '100%', height: '100%'}}>
                                            <div className="smallSpinner"></div> 
                                        </div>
                                    : 
                                        'Execute'
                                    }
                                </Button>
                            </>
                        :
                            <p className="text-danger">Failed to connect, try refreshing the page</p>
                }
            </div>

            <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[0] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(0)}}>
                    <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading`}>Activity</h5>
                    { toggle[0] ?
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>-</h5>
                        :
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>+</h5>
                    }
                </div>
                <div className="insetBorder" style={{height: '200px', overflow: 'scroll'}}>
                    { participants.map((p, idx) => {
                        return (
                        <div key={idx}>
                            <p>{p.name}
                            { p.typing ? 
                                <span>&ensp;⌨️</span>
                            :
                                <></>
                            }
                            { p.executing ? 
                                <span>&ensp;🏃🏽</span>
                            :
                                <></>
                            }
                            </p>
                        </div>
                        )
                    })}
                </div>
            </div>

            <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[1] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(1)}}>
                    <h5 className={`${toggle[1] ? '' : 'text-muted'} toggleBoxHeading`}>Results</h5>
                    { toggle[1] ?
                        <h5 className={`${toggle[1] ? '' : 'text-muted'} toggleBoxHeading dSign`}>-</h5>
                        :
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>+</h5>
                    }
                </div>
                <div className="insetBorder" style={{height: '400px', overflow: 'scroll'}}>
                    { result ?
                        
                        <div className="flex-column">
                            <p><span className="bold green">Time:</span> {result.time}</p>
                            <p><span className="bold green">Memory:</span> {result.memory}kb</p>
                            { result.stderr ?
                                <p style={{whiteSpace: 'pre-line'}}><span className="bold red">stderr:</span> {`\n${result.stderr}`}</p>
                            :
                                <p style={{whiteSpace: 'pre-line'}}><span className="bold green">stdout:</span> {`\n${result.stdout}`}</p>
                            }
                        </div>
                    :
                        executing ?
                            <p>Running...</p>
                        :
                            <p>No results yet, run code to see results.</p>
                    }
                </div>
            </div>
        </div>
    )
}


function SocialInfo({ session, file, reload, updateFile, setUpdateFile, fileNameError }) {

    const history = useHistory();

    const [inviteEmail, setInviteEmail] = useState("");

    const [newComment, setNewComment] = useState("");

    if (!session) {
        session = {
            'user_id': null,
            'email': null
        }
    }

    const fileOwner = session.user_id === file.user_id;

    const [toggle, setToggle] = useState([false, false, false]);

    const invited = file.invites.some((i) => {return i.email === session.email})

    function modifyName(ev) {
        let f1 = Object.assign({}, updateFile);
        f1['name'] = ev.target.value;
        setUpdateFile(f1);
    }

    function modifyDescription(ev) {
        let f1 = Object.assign({}, updateFile);
        f1['description'] = ev.target.value;
        setUpdateFile(f1);
    }

    function deleteInvite(ev) {
        delete_invite(ev.target.value).then((resp) => {
            reload("");
        })
    }

    function deleteComment(ev) {
        delete_comment(ev.target.value).then((resp) => {
            reload("");
        })
    }


    function submitInvite(ev) {
        ev.preventDefault();
        create_invite({
            "email": inviteEmail,
            "file_id": parseInt(file.id),
        }).then(() => {
            setInviteEmail("");
            reload("");
        })
    }

    function submitComment(ev) {
        ev.preventDefault();
        create_comment({
            "body": newComment,
            "file_id": file.id,
            "user_id": session.user_id
        }).then(() => {
            setNewComment("");
            reload("");
        })
    }

    function toggleBox(idx) {
        let t1 = [...toggle];
        t1[idx] = !t1[idx];
        setToggle(t1);
    }

    return (
        <div className="socialInfoContainer padding">
            <div style={{minHeight: '85px', width: '100%'}}>
                { fileOwner ?
                    <Form onSubmit={(ev) => (ev.preventDefault())} autoComplete="new-password" style={{width: '100%'}}>
                        <Form.Control autoComplete="unsupportedrandom" className="header-form" type="email" value={updateFile.name} onChange={modifyName} placeholder="Enter name" />
                    </Form>
                    :
                    <h1 className="fileNameText">{file.name}</h1>
                }
                { fileNameError ?
                    <p className="text-danger"> {fileNameError}</p>

                :
                    <p className="text-muted">Owner: <span className="hoverGreen" style={{cursor: 'pointer'}} onClick={() => {history.push(`/users/${file.user_id}`); ch_leave();}}>{file.user_name}</span></p>
                }
            </div>
            
            <div className={`box slimPadding boxHeadingContainer ${toggle[0] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(0)}}>
                    <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading`}>Description</h5>
                    { toggle[0] ?
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>-</h5>
                        :
                        <h5 className={`${toggle[0] ? '' : 'text-muted'} toggleBoxHeading dSign`}>+</h5>
                    }
                </div>
                <div style={{height: '10px'}}></div>
                { fileOwner ?
                    <Form onSubmit={(ev) => (ev.preventDefault())} autoComplete="new-password" style={{width: '100%'}}>
                        <Form.Group>
                            <Form.Control autoComplete="unsupportedrandom" className="dark-form muted" style={{height: '150px', resize: 'none'}} as="textarea" value={updateFile.description} onChange={modifyDescription} placeholder="Enter Description" />
                        </Form.Group>
                    </Form>
                    :
                    <div className="text-muted insetBorder" style={{height: '150px', overflowY: 'scroll', wordWrap: 'break-word'}}>{file.description ? file.description : 'None'}</div>
                }
            </div>

            <div className={`box slimPadding flex-column boxHeadingContainer ${toggle[1] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(1)}}>
                    <h5 className={`${toggle[1] ? '' : 'text-muted'} toggleBoxHeading`}>Invites</h5>
                    { toggle[1] ?
                        <h5 className={`${toggle[1] ? '' : 'text-muted'} toggleBoxHeading dSign`}>-</h5>
                        :
                        <h5 className={`${toggle[1] ? '' : 'text-muted'} toggleBoxHeading dSign`}>+</h5>
                    }
                </div>
                <div className="insetBorder" style={{height: `${fileOwner ? '200px' : '250px'}`, overflow: 'scroll'}}>
                    {
                        file.invites.map((i) => {
                            return (
                                <div className="flex-row center space-between inviteDisplay" key={i.id}>
                                    <p className="text-muted" style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '200px'}}>- {i.email}</p>
                                    { (fileOwner && (i.email !== session.email)) ?
                                        <Button className="inviteDisplayDelete" variant="outline-danger" onClick={deleteInvite} value={i.id}>Delete</Button>
                                        :
                                        <></>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                { fileOwner ?
                    <Form onSubmit={submitInvite} autoComplete="new-password" style={{width: '100%', overflow: 'visible'}}>
                        <div className="flex-row" style={{overflow: 'visible'}}>
                            <Form.Control autoComplete="unsupportedrandom" className="dark-form muted" type="text" value={inviteEmail} onChange={(ev) => {setInviteEmail(ev.target.value)}} placeholder="Invite email" />
                            <div style={{width: '15px'}}></div>
                            <Button variant={inviteEmail === "" ? 'outline-info' : 'outline-success'} type="submit">Invite</Button>
                        </div>
                    </Form>
                    :
                    <></>
                }
            </div>

            <div className={`box slimPadding commentContainer boxHeadingContainer ${toggle[2] ? '' : 'closed'}`} style={{margin: '10px 0px'}}>
                <div className="flex-column" style={{overflow: 'visible', width: '100%'}}>
                    <div style={{minHeight: '24px'}} className="flex-row space-between toggleBoxContainer" onClick={() => {toggleBox(2)}}>
                        <h5 className={`${toggle[2] ? '' : 'text-muted'} toggleBoxHeading`}>Comments</h5>
                        { toggle[2] ?
                            <h5 className={`${toggle[2] ? '' : 'text-muted'} toggleBoxHeading dSign`}>-</h5>
                            :
                            <h5 className={`${toggle[2] ? '' : 'text-muted'} toggleBoxHeading dSign`}>+</h5>
                        }
                    </div>
                    <div className="insetBorder" style={{height: `${(fileOwner || invited) ? '200px' : '250px'}`, overflow: 'scroll'}}>
                        {
                            file.comments.map((c) => {
                                return (
                                    <div className="flex-row space-between inviteDisplay" style={{marginBottom: '5px'}} key={c.id}>
                                        <p className="text-muted" style={{wordWrap: 'break-word', textOverflow: 'ellipsis', maxWidth: '170px'}}><span className="commentUserName">{c.user.name}: </span>{c.body}</p>
                                        { ((fileOwner) || (c.user.id === session.user_id))?
                                            <Button className="inviteDisplayDelete" style={{marginTop: '4px'}} variant="outline-danger" onClick={deleteComment} value={c.id}>Delete</Button>
                                            :
                                            <></>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    { (fileOwner || invited) ?
                        <Form onSubmit={submitComment} autoComplete="new-password" style={{width: '100%', overflow: 'visible'}}>
                            <div className="flex-row" style={{overflow: 'visible'}}>
                                <Form.Control autoComplete="unsupportedrandom" className="dark-form muted" type="text" value={newComment} onChange={(ev) => {setNewComment(ev.target.value)}} placeholder="Comment" />
                                <div style={{width: '15px'}}></div>
                                <Button variant={newComment === "" ? 'outline-info' : 'outline-success'} type="submit">Post</Button>
                            </div>
                        </Form>
                        :
                        <></>
                    }
                </div>
            </div>
        </div>
    )
}

function ShowFile({session}) {
    const { id } = useParams();

    const [body, setBody] = useState("");
    const [participants, setParticipants] = useState([]);
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState(null);
    const [connected, setConnected] = useState(0);

    const [fileNameError, setFileNameError] = useState(false);

    const [updateFile, setUpdateFile] = useState({
        'name': "",
        'description': ""
    });

    const [language, setLanguage] = useState(50);

    const [found, setFound] = useState(true);
    const [file, setFile] = useState({
        "name": "",
        "description": "",
        "language": 50,
        "user_name": "",
        "user_id": null,
        "user_email": "",
        "invites": [],
        "comments": [],
        "id": id,
        "alert": null
    });

    function handleUnload(ev) {
        ch_leave();
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleUnload);
      
        return () => window.removeEventListener("beforeunload", handleUnload);
      }, []);

    useEffect(() => {
        const stf = {
            setBody: setBody,
            setParticipants: setParticipants,
            setExecuting: setExecuting,
            setResult: setResult,
            setLanguage: setLanguage,
            setConnected: setConnected
        }

        show_file(id)
            .then((resp) => {
                setFile({
                    "name": resp.name,
                    "description": resp.description,
                    "language": resp.language,
                    "user_name": resp.user_name,
                    "user_id": resp.user_id,
                    "user_email": resp.user_email,
                    "invites": resp.invites,
                    "comments": resp.comments,
                    "id": id,
                    "alert": null
                });

                setUpdateFile({
                    'name': resp.name,
                    'description': resp.description === null ? "" : resp.description,
                });

                setBody(resp.body);

                setLanguage(resp.language);

                if (session) {
                    ch_join(`${resp.user_id}-${resp.id}`, session.name, session.user_id, resp.id, stf);
                }
            })
            .catch((e) => {
                if (e instanceof SyntaxError) {
                    setFound(false);
                }
            });
    }, [id, session])

    function reload(alert) {
        show_file(id)
            .then((resp) => {
                setFile({
                    "name": resp.name,
                    "description": resp.description,
                    "language": resp.language,
                    "user_name": resp.user_name,
                    "user_id": resp.user_id,
                    "user_email": resp.user_email,
                    "invites": resp.invites,
                    "comments": resp.comments,
                    "id": id,
                    "alert": alert
                });
            })
            .catch((e) => {
                if (e instanceof SyntaxError) {
                    setFound(false);
                }
            });
    }

    function save() {
        if (updateFile.name.length < 1) {
            setFileNameError('A file name is required');
        } else {
            setFileNameError(false);
            update_file(id, {
                'id': id,
                'file': {
                    'name': updateFile.name,
                    'description': updateFile.description,
                    'language': language,
                    'body': body
                }
            }).then((resp) => {
                if (resp.errors) {
                    setFileNameError('Something went wrong');
                    console.log(resp);
                }
            })
        }
    }

    function bodyChange(val) {
        setBody(val);
        ch_update(val);
    }

    function idToMode(id) {

        if (typeof id === 'string') {
            switch (id) {
                case '50':
                    return 'c_cpp';
                case '54':
                    return 'c_cpp';
                case '57':
                    return 'elixir';
                case '62':
                    return 'java';
                case '63':
                    return 'javascript';
                case '69':
                    return 'prolog';
                case '71':
                    return 'python';
                case '72':
                    return 'ruby';
                case '83':
                    return 'swift';
                default:
                    console.log(`idToMode - unkown language id: ${id}`);
                    return 'python'
            }
        } else {
            switch (id) {
                case 50:
                    return 'c_cpp';
                case 54:
                    return 'c_cpp';
                case 57:
                    return 'elixir';
                case 62:
                    return 'java';
                case 63:
                    return 'javascript';
                case 69:
                    return 'prolog';
                case 71:
                    return 'python';
                case 72:
                    return 'ruby';
                case 83:
                    return 'swift';
                default:
                    console.log(`idToMode - unkown language id: ${id}`);
                    return 'python'
            }
        }
    }

    if (found) {
        return (
            <div className="maxSize">
                <div className="flex-row">
                    <div className="fileInfoContainer">
                        { session ?
                            <SocialInfo session={session} file={file} reload={reload} updateFile={updateFile} setUpdateFile={setUpdateFile} fileNameError={fileNameError} />
                        :
                            <Login id={id} file={file} />
                        }
                   
                    </div>
                    <div className="fileAceContainer">
                        <AceEditor 
                                mode={idToMode(language)}
                                theme="pastel_on_dark" 
                                height="100vh"
                                width="100%"
                                value={body} 
                                onChange={bodyChange} 
                                onBlur={() => {ch_stop_typing()}}
                                highlightActiveLine={true}
                                showGutter={true}
                                readOnly={false}
                                setOptions={{
                                    enableLiveAutocompletion: true, 
                                    showLineNumbers: true,
                                    readOnly: (session ? false : true)
                                }}
                            />
                    </div>
                    <div className="fileInfoContainer">
                        { session ?
                            <EditorInfo session={session} file={file} language={language} setLanguage={setLanguage} save={save} body={body} participants={participants} result={result} executing={executing} connected={connected}/>
                        :
                            <NoSession id={id} language={language} />
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="maxSize padding">
                <HomeIcon />
                <div style={{height: '30px'}}></div>
                <p>file with id {id} not found</p>
            </div>
        )
    }
}

export default connect(({session}) => ({session}))(ShowFile)