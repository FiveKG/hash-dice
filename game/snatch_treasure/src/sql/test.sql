SELECT 'SELECT ' || array_to_string(
        ARRAY(SELECT 'o' || '.' || c.column_name 
                FROM information_schema.columns As c 
                WHERE table_name = 'book_list_detail' 
                AND  c.column_name 
                NOT IN('summary')
        ), ',') || ' FROM book_list_detail As o' As sqlstmt;