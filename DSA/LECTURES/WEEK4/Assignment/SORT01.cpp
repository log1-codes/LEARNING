#include <bits/stdc++.h>
using namespace std;

int main()
{
    int t;
    cin >> t;

    while (t--)
    {
        int N;
        cin >> N;

        vector<int> a(N);
        for (int i = 0; i < N; i++)
            cin >> a[i];

        vector<int> zero, one;

        for (int i = 0; i < N; i++)
        {
            if (a[i] == 0)
                zero.push_back(0);
            else
                one.push_back(1);
        }

        for (int x : zero) cout << x << " ";
        for (int x : one) cout << x << " ";
        cout << "\n";
    }
    return 0;
}

//count method

// int cnt0 = 0, cnt1 = 0;

// for (int x : a)
// {
//     if (x == 0) cnt0++;
//     else cnt1++;
// }

// while (cnt0--) cout << 0 << " ";
// while (cnt1--) cout << 1 << " ";
