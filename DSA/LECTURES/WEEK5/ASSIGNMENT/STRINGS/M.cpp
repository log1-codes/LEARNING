#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;

    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
        if (s[left] != s[right]) {
            cout << "NO";
            return 0;
        }
        left++;
        right--;
    }

    cout << "YES";
    return 0;
}
