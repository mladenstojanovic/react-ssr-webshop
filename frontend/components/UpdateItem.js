import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`

class UpdateItem extends Component {
    state = { }
    handleChange = e => {
        const { name, type, value } = e.target
        const val = type === 'number' ? value ? parseFloat(value) : value : value
        this.setState({ [name]: val })
    }
    updateItem = async (e, updateItemMutation) => {
        e.preventDefault()
        console.log('Updating item!!')
        console.log(this.state)
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state,
            },
        })
        console.log('updated', res)
    }
    render() {
        const { uploading } = this.state
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id
            }}>
                {({data, loading}) => {
                    if (loading) return <p>Loading...</p>
                    if (!data.item) return <p>No Item Found for ID {this.props.id}</p>
                    return (
                        <Mutation
                            mutation={UPDATE_ITEM_MUTATION}
                            variables={this.state}
                        >
                            {(updateItem, { loading, error }) => (
                                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                    <Error error={error} />
                                    <fieldset disabled={loading || uploading} aria-busy={loading || uploading}>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                defaultValue={data.item.title}
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
                                                defaultValue={data.item.price}
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
                                                defaultValue={data.item.description}
                                                onChange={this.handleChange}
                                                id="description"
                                                name="description"
                                                placeholder="Enter A Description"
                                                required
                                            />
                                        </label>
                                        <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }