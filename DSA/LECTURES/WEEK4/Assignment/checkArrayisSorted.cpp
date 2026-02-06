#include <bits/stdc++.h>
using namespace std;

int main()
{
    int N;
    cin >> N;

    vector<long long> a(N);
    for (int i = 0; i < N; i++)
        cin >> a[i];

    for (int i = 0; i < N - 1; i++)
    {
        if (a[i] > a[i + 1])
        {
            cout << "NO";
            return 0;
        }
    }

    cout << "YES";
    return 0;
}
