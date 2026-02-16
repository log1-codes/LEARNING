#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;

    string result = "";

    for (int i = s.length() - 1; i >= 0; i--) {
        result += s[i];
    }

    cout << result;

    return 0;
}
