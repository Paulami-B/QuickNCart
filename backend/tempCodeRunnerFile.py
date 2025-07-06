@app.route('/getOrder', methods=['GET'])
def get_order():
    o_id = request.args.get('order_id')

    if not o_id:
        return jsonify({'error': 'Missing Order ID'}), 400

    response = order_items_dao.get_order_details(connection, o_id)