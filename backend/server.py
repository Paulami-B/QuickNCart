from flask import Flask, request, jsonify
from flask_cors import CORS
from sql_connection import get_sql_connection
import mysql.connector
import json

import products_dao
import orders_dao
import order_items_dao

app = Flask(__name__)
CORS(app)
connection = get_sql_connection()

@app.route('/getProducts', methods=['GET'])
def get_all_products():
    response = products_dao.get_products(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertProduct', methods=['POST'])
def insert_product():
    request_payload = json.loads(request.form['data'])
    product_id = products_dao.insert_new_product(connection, request_payload)
    response = jsonify({
        'product_id': product_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    return_id = products_dao.delete_product(connection, request.form['product_id'])
    response = jsonify({
        'product_id': return_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = request.get_json()

    if not request_payload:
        return jsonify({'error': 'Invalid or missing JSON'}), 400
    # order_id = orders_dao.insert_new_order(connection, request_payload)
    order_id = order_items_dao.add_order_item(connection, request_payload)
    response = jsonify({
        'order_id': order_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    response = order_items_dao.get_orders(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getOrder', methods=['GET'])
def get_order():
    oreder_id = request.args.get('order_id')

    if not o_id:
        return jsonify({'error': 'Missing Order ID'}), 400

    response_1 = order_items_dao.get_order_details(connection, order_id)
    response_2 = orders_dao.get_order_details(connection, order_id)
    response = jsonify({
        'c_name': response_2['c_name'],
        'date': response_2['date'],
        'orders': response_1
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/deleteOrder', methods=['POST'])
def delete_order():
    data = request.get_json()
    return_id = orders_dao.delete_order_details(connection, data['order_id'])
    response = jsonify({
        'order_id': return_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)