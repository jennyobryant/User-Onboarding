import React, {useState, useEffect} from 'react'
import { withFormik, Form, Field } from 'formik'; //1. import formik
import * as yup from 'yup'; //2. import yup, 3. last is submit to API
import axios from 'axios'
import { keyToTestName } from 'jest-snapshot/build/utils';

const UserForm = ({errors, touched, status})=> {//fix bug it does not show error all the time (add touched), just you forget
    console.log (status)
    const [users, setUsers] = useState ([])

    useEffect (()=> {
        if (status) {
        setUsers([...users, status])
        }
    }, [status])

    return (//2. add the errors message for validation 
    <Form>
        {touched.Name && errors.Name && <p className ='error'>{errors.Name} </p>}
        <Field type ="text" name ="Name" placeholder ="*Name" />

        {touched.Email && errors.Email && <p className ='error'>{errors.Email} </p>}
        <Field type ="email" name ="Email" placeholder ="*Email" />

        {touched.Password && errors.Password && <p className ='error'>{errors.Password} </p>}
        <Field type ="password" name ="Password" placeholder ="*Password" />

        {touched.TermsofService && errors.TermsofService && <p className ='error'>{errors.TermsofService} </p>}

        <label>
        <Field type ="checkbox" name ="TermsofService"/>
        <span>Terms of Service</span>
        </label>

        <button type ="submit">Submit</button>

    {
        // Name {status.Name} <br />
        // Email {status.Email} <br />
        // Password {status.Password} <br />
        // TermsofService {status.TermsofService} <br />
    }
        {users.map(user => (
            <div key={user.Email}>Name: {user.Name}</div>
        ))}
    </Form>
    )
}

export default withFormik({ //1 export formik, send the value to mapProps for formik, this is higher order components, (values) is from Formik
    mapPropsToValues: (values) => {
        return{
            Name: values.Name || "", 
            Email: values.Email || "",
            Password: values.Password ||"",
            TermsofService: values.TermsofService || false
        }
    },
    validationSchema: yup.object().shape ({
        Name: yup.string().required("Name is required!"),
        Email: yup.string().required("Email is required!"),
        Password: yup.string().required("Password is required!"),
        TermsofService: yup.boolean().oneOf([true], "Must check the Terms of Service")
    }),
    handleSubmit: (values, { setStatus }) => {//value comes through to setter 
       // "https://reqres.in/api/users"//3. how to POST rquest this url? 
       axios.post("https://reqres.in/api/users", values)
        .then((res) => {
           setStatus(res.data)
        })
        .catch((err) => {
            console.log("Error:", err)
        })
    }
})(UserForm)