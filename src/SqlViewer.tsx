'use client';

import { Button } from '@headlessui/react';
import { useState } from 'react';

export function SQLViewer() {
  const [isVisible, setIsVisible] = useState(true);

  // Mock data - in a real application, this would be populated dynamically
  const sqlQuery =
    "SELECT * FROM users WHERE signup_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');";
  const results = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      signup_date: '2023-05-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      signup_date: '2023-05-20',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      signup_date: '2023-05-25',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-md font-medium">SQL Query and Results</div>
        <Button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isVisible && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">SQL Query:</h3>
              <pre className="bg-muted overflow-x-auto rounded-md p-2 text-xs">
                {sqlQuery}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium">Results:</h3>
              <ScrollArea className="h-[300px]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="p-2 text-left">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value, valueIndex) => (
                          <td key={valueIndex} className="p-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      )}
    </div>
  );
}
