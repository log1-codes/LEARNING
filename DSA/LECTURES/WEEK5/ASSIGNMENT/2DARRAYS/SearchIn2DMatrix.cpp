#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, m, x;
    cin >> n >> m >> x;

    bool found = false;

    for(int i = 0; i < n; i++)
    {
        for(int j = 0; j < m; j++)
        {
            int value;
            cin >> value;

            if(value == x)
                found = true;
        }
    }

    cout << (found ? "true" : "false");

    return 0;
}
