from sql_connection import get_sql_connection

def add_order_item(connection, order):
    try:
        cursor = connection.cursor()
        query_1 = ("INSERT INTO Orders "
                "(Date, Customer_Name) "
                "VALUES (%s, %s)")
        
        data_1 = (order['date'], order['c_name'])
        query_2 = ("INSERT INTO Order_Items "
                "(O_ID, P_ID, Quantity) "
                "VALUES ("
                "%s, "
                "(SELECT ID FROM Products WHERE Name = %s LIMIT 1), "
                "%s)")

        cursor.execute(query_1, data_1)
        order_id = cursor.lastrowid
        for item in order['items']:
            data_2 = (order_id, item['p_name'], item['qty'])
            cursor.execute(query_2, data_2)

        connection.commit()
        return order_id
    except Exception as e:
        connection.rollback()
        print("Transaction failed:", e)

    finally:
        cursor.close()


def get_orders(connection):
    cursor = connection.cursor()

    query = ("SELECT "
            "O.ID AS O_ID, "
            "O.Customer_Name AS O_Name, "
            "O.Date AS O_Date, "
            "SUM(P.Price_Per_Unit * OI.Quantity) AS Total "
            "FROM Order_Items OI "
            "JOIN Orders O ON OI.O_ID = O.ID "
            "JOIN Products P ON OI.P_ID = P.ID "
            "GROUP BY OI.O_ID")
    
    cursor.execute(query)

    response = []

    for O_ID, O_Name, O_Date, Total in cursor:
        response.append({
            'o_id': O_ID,
            'o_name': O_Name,
            'o_date': O_Date,
            'total': Total
        })
    
    return response


def get_order_details(connection, o_id):
    cursor = connection.cursor()

    query = ("SELECT "
            "P.ID AS P_ID, "
            "P.Name AS P_Name, "
            "P.Unit AS Unit, "
            "OI.Quantity AS Qty, "
            "(P.Price_Per_Unit * OI.Quantity) AS Amount "
            "FROM Order_Items OI "
            "JOIN Products P ON OI.P_ID = P.ID "
            "WHERE OI.O_ID = %s")
    
    cursor.execute(query, (o_id,))

    response = []
    for P_ID, P_Name, Unit, Qty, Amount in cursor:
        response.append({
            'p_id': P_ID,
            'p_name': P_Name,
            'unit': Unit,
            'qty': Qty,
            'amount': Amount
        })
    
    return response


if __name__ == '__main__':
    connection = get_sql_connection()
    # print(get_all_products(connection))
    print(get_orders(connection))