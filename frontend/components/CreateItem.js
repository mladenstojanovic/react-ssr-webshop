import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`

class CreateItem extends Component {
    state = {
        title: 'Tike',
        description: 'Vrh tike!',
        image: '',
        largeImage: '',
        price: 3000,
        uploading: false,
    }
    handleChange = e => {
        const { name, type, value } = e.target
        const val = type === 'number' ? value ? parseFloat(value) : value : value
        this.setState({ [name]: val })
    }
    uploadFile = async e => {
        console.log('Uploading file...')
        this.setState({
            uploading: true,
        })
        const files = e.target.files
        const data = new FormData();
        data.append('file', files[0])
        data.append('upload_preset', 'shopfits')

        const res = await fetch('https://api.cloudinary.com/v1_1/mladenstojanovic/image/upload', {
            method: 'POST',
            body: data,
        })
        const file = await res.json()
        console.log(file)
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url,
            uploading: false,
        })
    }
    render() {
        const { uploading } = this.state
        return (
            <Mutation
                mutation={CREATE_ITEM_MUTATION}
                variables={this.state}
            >
                {(createItem, { loading, error }) => (
                    <Form onSubmit={async e => {
                        // Stop the form from submitting
                        e.preventDefault()
                        // Call the mutation
                        const res = await createItem()
                        // Change them to the single item page
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id },
                        })
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading || uploading} aria-busy={loading || uploading}>
                            <label htmlFor="file">
                                Image
                                <input
                                    onChange={this.uploadFile}
                                    type="file"
                                    id="file"
                                    name="file"
                                    placeholder="Upload an image"
                                    required
                                />
                                {this.state.image && <img src={this.state.image} alt="Upload Preview" width="200" />}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Title"
                                    required
                                />
                            </label>
                            <label htmlFor="price">
                                Price
                                <input
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    type="number"
                                    id="price"
                                    name="price"
                                    placeholder="Price"
                                    required
                                />
                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    id="description"
                                    name="description"
                                    placeholder="Enter A Description"
                                    required
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>

        )
    }
}

export default CreateItem
export { CREATE_ITEM_MUTATION }