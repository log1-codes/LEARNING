#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;

    while (t--) {
        int n;
        cin >> n;
        vector<int> arr1(n);
        for (int i = 0; i < n; i++) {
            cin >> arr1[i];
        }

        int m;
        cin >> m;
        vector<int> arr2(m);
        for (int i = 0; i < m; i++) {
            cin >> arr2[i];
        }

        unordered_map<int, int> freq;
        for (int x : arr2) {
            freq[x]++;
        }

        for (int x : arr1) {
            if (freq[x] > 0) {
                cout << x << " ";
                freq[x]--;
            }
        }
        cout << "\n";
    }
}
