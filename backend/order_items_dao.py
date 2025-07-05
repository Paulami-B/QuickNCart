from sql_connection import get_sql_connection

def add_order_item(connection, order):
    cursor = connection.cursor()
    query = ("INSERT INTO Order_Items "
            "(O_ID, P_ID, Quantity) "
            "VALUES ("
            "%s, "
            "(SELECT ID FROM Products WHERE Name = %s LIMIT 1)"
            "%s)")
    data = (order['o_id'], order['p_name'], order['quantity'])

    cursor.execute(query, data)


def get_orders(connection):
    cursor = connection.cursor()

    query = ("SELECT "
            "O.ID AS O_ID, "
            "O.Name AS O_Name, "
            "SUM(P.Price_Per_Unit * OI.Quantity) AS Total"
            "FROM Order_Items OI "
            "JOIN Orders O ON OI.O_ID = O.ID "
            "JOIN Products P ON OI.P_ID = P.ID "
            "GROUP BY OI.O_ID")
    
    cursor.execute(query)

    response = []

    for O_ID, O_Name, Total in cursor:
        response.append({
            'o_id': O_ID,
            'o_name': O_Name,
            'total': Total
        })
    
    return response


def get_orders_details(connection, o_id):
    cursor = connection.cursor()

    query = ("SELECT "
            "P.Name AS P_Name "
            "P.Unit AS Unit "
            "OI.Quantity AS Qty "
            "(P.Price_Per_Unit * OI.Quantity) AS Amount "
            "FROM Order_Items OI "
            "JOIN Products P ON OI.P_ID = P.ID "
            "WHERE OI.O_ID = %s")
    
    cursor.execute(query, o_id)

    response = []
    total = 0
    for P_Name, Unit, Qty, Amount in cursor:
        response.append({
            'p_name': P_Name,
            'unit': Unit,
            'qty': Qty,
            'amount': Amount
        })
        total = total+Amount
    
    return response, total