#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n, m;
    cin >> n >> m;

    int maxCount = 0;
    int answerIndex = -1;

    for(int i = 0; i < n; i++)
    {
        int rowCount = 0;

        for(int j = 0; j < m; j++)
        {
            int value;
            cin >> value;

            if(value == 1)
                rowCount++;
        }

        if(rowCount > maxCount)
        {
            maxCount = rowCount;
            answerIndex = i;
        }
    }

    if(maxCount == 0)
        cout << -1;
    else
        cout << answerIndex;

    return 0;
}
