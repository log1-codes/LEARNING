#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        int N;
        cin >> N;

        int ans = 0, x;
        for (int i = 0; i < N; i++) {
            cin >> x;
            ans ^= x;
        }
        for (int i = 0; i <= N - 2; i++) {
            ans ^= i;
        }

        cout << ans << "\n";
    }
}
