#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    cin >> n >> x;

    vector<long long> A(n);
    for (int i = 0; i < n; i++) {
        cin >> A[i];
    }

    long long ans = 0;

    for (int j = 1; j < n - 2; j++) {
        unordered_map<long long, long long> freq;

        // i < j
        for (int i = 0; i < j; i++) {
            long long val = A[i] - 2 * A[j];
            freq[val]++;
        }

        // k > j
        for (int k = j + 1; k < n - 1; k++) {
            // l > k
            for (int l = k + 1; l < n; l++) {
                long long right = 3 * A[k] - 4 * A[l];
                long long need = x - right;

                if (freq.count(need)) {
                    ans += freq[need];
                }
            }
        }
    }

    cout << ans << "\n";
    return 0;
}
